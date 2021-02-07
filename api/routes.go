package api

import (
	"github.com/gin-contrib/cors"
	ginstatic "github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

// CollectRouter return gin router
func CollectRouter(mode, static string) *gin.Engine {
	if len(mode) > 0 {
		gin.SetMode(mode)
	}
	r := gin.Default()
	r.Use(cors.Default())
	r.Use(ginstatic.Serve("/", ginstatic.LocalFile(static, false)))

	r.GET("/api/bugua", BuGua)

	return r
}
