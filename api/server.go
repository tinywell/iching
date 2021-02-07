package api

import (
	"github.com/gin-gonic/gin"
	"github.com/tinywell/iching/pkg"
)

// BuGua ...
func BuGua(c *gin.Context) {
	c.JSON(200, pkg.Bu())
}
