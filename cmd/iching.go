package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/tinywell/iching/cmd/server"
)

var (
	rootCmd = &cobra.Command{
		Use:   "iching",
		Short: "iching 易经 64 卦",
	}
)

func main() {
	rootCmd.AddCommand(server.ServerCmd)

	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
