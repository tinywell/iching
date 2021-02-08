package pkg

import (
	"strconv"
	"strings"
)

// Yao 爻
type Yao struct {
	Ji     int  `json:"ji" db:"ji"`         // 衍数
	Yi     int  `json:"yi" db:"yi"`         // 阴阳
	Change bool `json:"change" db:"change"` // 定变
}

// NewYao ...
func NewYao(ji int) Yao {
	ny := Yao{
		Ji: ji,
	}
	switch ji {
	case 6: //老阴 变爻
		ny.Yi = 0
		ny.Change = true
	case 7: //少阳 定爻
		ny.Yi = 1
		ny.Change = false
	case 8: //少阴 定爻
		ny.Yi = 0
		ny.Change = false
	case 9: //老阳 变爻
		ny.Yi = 1
		ny.Change = true
	default:
		// 错误
	}
	return ny
}

// XiaoGua 卦
type XiaoGua struct {
	One   Yao
	Two   Yao
	Three Yao
}

// ID ...
func (g XiaoGua) ID() string {
	idstr := []string{strconv.Itoa(g.One.Yi), strconv.Itoa(g.Two.Yi), strconv.Itoa(g.Three.Yi)}
	return strings.Join(idstr, "")
}

func (g XiaoGua) String() string {
	id := g.ID()
	return GUA[id]
}

// Gua ...
type Gua struct {
	Shang Yao    `json:"shang" db:"shang"`
	Wu    Yao    `json:"wu" db:"wu"`
	Si    Yao    `json:"si" db:"si"`
	San   Yao    `json:"san" db:"san"`
	Er    Yao    `json:"er" db:"er"`
	Chu   Yao    `json:"chu" db:"chu"`
	ID    string `json:"id" db:"id"`
}

// GenerateID ...
func (g Gua) GenerateID() string {
	ids := []string{
		strconv.Itoa(g.Shang.Yi),
		strconv.Itoa(g.Wu.Yi),
		strconv.Itoa(g.Si.Yi),
		strconv.Itoa(g.San.Yi),
		strconv.Itoa(g.Er.Yi),
		strconv.Itoa(g.Chu.Yi)}
	return strings.Join(ids, "")
}
