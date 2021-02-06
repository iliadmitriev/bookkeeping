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

const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const addMonths = (dt, n) =>
{
  const newDt = new Date(dt)
  newDt.setMonth(dt.getMonth() + n)
  return newDt
}

export  { random_rgba, validateEmail, addMonths }
