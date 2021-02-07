package server

import (
	"fmt"
	"log"
	"net/http"

	// pprof for server
	_ "net/http/pprof"

	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"github.com/tinywell/iching/api"
)

var (
	port       int
	production bool
	static     string

	// ServerCmd server subcommand
	ServerCmd = &cobra.Command{
		Use:   "server",
		Short: "server is a backend web service use of gin",
		Run: func(cmd *cobra.Command, args []string) {
			Execute()
		},
	}
)

func init() {
	ServerCmd.PersistentFlags().IntVarP(&port, "port", "p", 8080, "listen port")
	ServerCmd.PersistentFlags().BoolVarP(&production, "production", "m", false, "is in production mode")
	ServerCmd.PersistentFlags().StringVarP(&static, "static", "s", "./front/dist", "front page path")
}

// Execute execute server command
func Execute() {

	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	var mode = gin.DebugMode
	if production {
		mode = gin.ReleaseMode
	}

	r := api.CollectRouter(mode, static)

	if err := r.Run(fmt.Sprintf("0.0.0.0:%d", port)); err != nil {
		panic(err)
	}
}
