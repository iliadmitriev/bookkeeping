const random_rgba = (len, coefficient=0.2) => {
  const o = Math.round, rnd = Math.random, s = 255
  const backgroundColors=[], borderColors = []

  for (let i = 0; i<len; i++) {
    const r = o(rnd()*s), g = o(rnd()*s), b = o(rnd()*s)
    backgroundColors.push(`rgba(${r},${g},${b}, ${coefficient})`)
    borderColors.push(`rgba(${r},${g},${b}, 1)`)
  }

  return {backgroundColors, borderColors}
}

export  { random_rgba }
