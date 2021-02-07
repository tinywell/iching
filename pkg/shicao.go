package pkg

import (
	"crypto/rand"
	"math/big"
	"strings"
)

const (
	dayan  = 50
	qiyong = 49
)

// 一变
func bian(shu int) int {
	// 1. 分二
	left := fener(shu)
	right := shu - left

	// 2. 挂一
	right = right - 1
	// fmt.Printf("left: %d right: %d ", left, right)
	// 3. 揲四
	ly := shesi(left)
	ry := shesi(right)
	// fmt.Printf("ly: %d ry: %d ", ly, ry)
	// 4. 归奇
	ji := ly + ry + 1
	// fmt.Printf("ji: %d\n", ji)
	return ji
}

func fener(shu int) int {
	for {
		r, err := rand.Int(rand.Reader, big.NewInt(int64(shu)))
		if err == nil && r != big.NewInt(0) {
			return int(r.Int64())
		}
	}
}

func shesi(cao int) int {
	yu := cao % 4
	if yu == 0 {
		yu = 4
	}
	return yu
}

// 一爻
func yao() int {
	shu := qiyong
	for i := 0; i < 3; i++ {
		bian := bian(shu)
		// fmt.Printf("shu: %d bian: %d\n", shu, bian)
		shu = shu - bian
	}
	return shu / 4
}

// BuGua 小卦
func BuGua() XiaoGua {
	gua := XiaoGua{
		One:   NewYao(yao()),
		Two:   NewYao(yao()),
		Three: NewYao(yao()),
	}
	return gua
}

// Bu 卜卦
func Bu() Gua {
	shang := BuGua()
	xia := BuGua()
	gua := Gua{
		Shang: shang.One,
		Wu:    shang.Two,
		Si:    shang.Three,
		San:   xia.One,
		Er:    xia.Two,
		Chu:   xia.Three,
	}
	ids := []string{shang.ID(), xia.ID()}
	gua.ID = strings.Join(ids, "")
	return gua
}
