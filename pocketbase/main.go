package main

import (
	"compress/gzip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

const STORAGE_PATH = "./pb_data/raw"

type Event struct {
	TimeStamp string `json:"timestamp"`
	Type      string `json:"type"`
}

type DirectMessage struct {
	TimeSent string `json:"timestamp"`
	SentByMe bool   `json:"sentByMe"`
}

type Archive struct {
	StartDate      string          `json:"startDate"`
	Activities     []Event         `json:"activities"`
	Interactions   []Event         `json:"interactions"`
	DirectMessages []DirectMessage `json:"directMessages"`
}

// Write compressed data to a file
func writeCompressedFile(filePath string, data Archive) error {
	// Convert the []DataItem array to JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	// Create the file for writing compressed data
	file, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Create a gzip writer
	gzipWriter := gzip.NewWriter(file)
	defer gzipWriter.Close()

	// Write compressed data
	_, err = gzipWriter.Write(jsonData)
	if err != nil {
		return err
	}

	return nil
}

// Read and decompress the file
func readCompressedFile(filePath string) (Archive, error) {
	// Open the compressed file
	file, err := os.Open(filePath)
	if err != nil {
		return Archive{}, err
	}
	defer file.Close()

	// Create a gzip reader
	gzipReader, err := gzip.NewReader(file)
	if err != nil {
		return Archive{}, err
	}
	defer gzipReader.Close()

	// Read and decompress the data
	decompressedData, err := io.ReadAll(gzipReader)
	if err != nil {
		return Archive{}, err
	}

	// Unmarshal the decompressed data into Archive
	var archive Archive
	if err := json.Unmarshal(decompressedData, &archive); err != nil {
		return Archive{}, err
	}

	return archive, nil
}

func main() {
	app := pocketbase.New()

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// serves static files from the provided public dir (if exists)
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./pb_public"), false))

		se.Router.POST("/upload", func(e *core.RequestEvent) error {
			// Check if the content type is gzip
			contentType := e.Request.Header.Get("Content-Type")
			if contentType != "application/gzip" {
				return e.Error(http.StatusUnsupportedMediaType, "Unsupported Content-Type", nil)
			}

			// Create gzip reader from request body
			gzipReader, err := gzip.NewReader(e.Request.Body)
			if err != nil {
				log.Println("Failed to create gzip reader:", err)
				return e.Error(http.StatusBadRequest, "Invalid gzip data", nil)
			}
			defer gzipReader.Close()

			// Read and decompress the request body
			decompressedData, err := io.ReadAll(gzipReader)
			if err != nil {
				log.Println("Failed to read decompressed data:", err)
				return e.Error(http.StatusInternalServerError, "Failed to process data", nil)
			}

			// Parse JSON from decompressed data
			var archive Archive
			if err := json.Unmarshal(decompressedData, &archive); err != nil {
				log.Println("Failed to parse JSON:", err)
				return e.Error(http.StatusBadRequest, "Invalid JSON format", nil)
			}

			timestamp := time.Now()
			fileName := fmt.Sprintf("%s.json.gz", timestamp.Format("2006-01-02_15:04:05.000"))
			filePath := filepath.Join(STORAGE_PATH, fileName)

			err = writeCompressedFile(filePath, archive)
			if err != nil {
				log.Println("Failed to save compressed file:", err)
				return e.Error(http.StatusInternalServerError, "Failed to save file", nil)
			}

			collection, err := app.FindCollectionByNameOrId("archives")
			if err != nil {
				log.Println("Error: ", err)
				return err
			}

			record := core.NewRecord(collection)
			record.Set("filePath", filePath)

			err = app.Save(record)
			if err != nil {
				return err
			}

			e.NoContent(http.StatusNoContent)
			return nil
		})

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
