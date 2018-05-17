import * as bmson from 'bmson'

import BMS from 'bms'

import Notechart from '../'

export function load (source, options) {
  let data = JSON.parse(source)
  let songInfo = bmson.songInfoForBmson(data)
  let score = bmson.musicalScoreForBmson(data)
  let barLines = bmson.barLinesForBmson(data)

  let stuff = {
    notes: score.notes.all(),
    timing: score.timing,
    keysounds: score.keysounds,
    songInfo,
    positioning: new BMS.Positioning([
      { t: 0, x: 0, dx: 1, inclusive: true }
    ]),
    spacing: new BMS.Spacing([ ]),
    barLines,
    images: { // HACK: Hardcoded here, probably should belong in bmson package
      eyecatch: data.info.eyecatch_image,
      background: data.info.back_image
    },
    expertJudgmentWindow: getExpertJudgmentWindowForBmson(data)
  }

  return new Notechart(stuff, options)
}

function getExpertJudgmentWindowForBmson (data) {
  const judgeRank = (() => {
    if (!data.info) return 100
    if (!data.info.judge_rank) return 100
    return +data.info.judge_rank || 100
  })() / 100
  return [ 18 * judgeRank, 40 * judgeRank ]
}
