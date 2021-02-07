package pkg

import "testing"

func TestYao(t *testing.T) {
	yao := yao()
	t.Log(yao)
}

func TestFener(t *testing.T) {
	t.Log(fener(49))
}

func TestGua(t *testing.T) {
	t.Log(BuGua())
}

func TestBu(t *testing.T) {
	t.Log(Bu())
}
