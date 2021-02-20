const qiyong = 49;

function shesi(cao) {
  let yu = cao % 4;
  if (yu === 0) {
    yu = 4;
  }
  return yu;
}

function fener(shu) {
  while (true) {
    const r = Math.floor(Math.random() * shu);
    if (r !== 0) {
      return r;
    }
  }
}

// 一变
function bian(shu) {
  // 1. 分二
  const left = fener(shu);
  let right = shu - left;

  // 2. 挂一
  right -= 1;

  // 3. 揲四
  const ly = shesi(left);
  const ry = shesi(right);

  // 4. 归奇
  const ji = ly + ry + 1;
  return ji;
}

// 一爻
function yao() {
  let shu = qiyong;
  for (let i = 0; i < 3; i += 1) {
    const bianr = bian(shu);
    shu -= bianr;
  }
  return shu / 4;
}

// GenerateID ...
function GenerateID(chu, er, san, si, wu, shang) {
  const ids = [
    shang.yi.toString(),
    wu.yi.toString(),
    si.yi.toString(),
    san.yi.toString(),
    er.yi.toString(),
    chu.yi.toString(),
  ];
  return ids.join('');
}

function NewYao(jishu) {
  const ny = {
    ji: jishu,
    yi: 0,
    change: false,
  };
  switch (jishu) {
    case 6: // 老阴 变爻
      ny.yi = 0;
      ny.change = true;
      break;
    case 7: // 少阳 定爻
      ny.yi = 1;
      ny.change = false;
      break;
    case 8: // 少阴 定爻
      ny.yi = 0;
      ny.change = false;
      break;
    case 9: // 老阳 变爻
      ny.yi = 1;
      ny.change = true;
      break;
    default:
      // 错误
  }
  return ny;
}

export function Gua() {
  const gua = {
    chu: NewYao(yao()),
    er: NewYao(yao()),
    san: NewYao(yao()),
    si: NewYao(yao()),
    wu: NewYao(yao()),
    shang: NewYao(yao()),
    id: '',
  };
  gua.id = GenerateID(gua.chu, gua.er, gua.san, gua.si, gua.wu, gua.shang);
  return gua;
}

export default Gua;
