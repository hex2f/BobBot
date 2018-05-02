class top {
  constructor (thot) {
    this.thot = thot

    this.thot.register({ command: 'b!top', usage: '<Page>', description: 'Shows the xp leaderboard.', callback: this.handle.bind(this), admin: false })
  }

  async handle (message) {
    let xp = this.thot.storage.xp
    if (!xp) { return }

    let page = 0

    if (!isNaN(parseInt(message.content.split(' ')[1]))) { page = parseInt(message.content.split(' ')[1]) - 1 }

    let leaderboard = []

    Object.keys(xp).forEach(key => {
      if (xp[key].points === undefined) { xp[key] = {points: 0, booster: null, lastGain: 0} }
      if (isNaN(parseInt(xp[key].points))) { xp[key].points = 0 }
      leaderboard.push({
        userid: key,
        points: xp[key].points
      })
    })

    leaderboard.sort((a, b) => {
      if (a.points > b.points) return -1
      if (a.points < b.points) return 1
      return 0
    })

    if (page > 0) {
      leaderboard = leaderboard.slice(10 * page + 1, 10 * page + 11)
    } else {
      leaderboard = leaderboard.slice(0, 10)
    }

    if (leaderboard.length === 0) {
      this.thot.send(message.channel, {
        title: `XP Leaderboard`,
        description: `Page ${page + 1} is out of range.`,
        color: 15347007
      })
      return
    }

    let topStr = ''
    let i = 1

    await leaderboard.forEach(async uid => {
      let user = message.guild.members.get(uid.userid)
      if (!user) { user = await message.guild.fetchMember(uid.userid) }

      if (isNaN(parseInt(uid.points))) {
        uid.points = 0
        this.thot.set('xp', uid.userid, {points: uid.points, booster: null, lastGain: 0})
      }

      topStr += `**[${i + (page * 10)}]** ${user.user.username}#${user.user.discriminator} - ${uid.points} xp\n`

      i++
    })

    this.thot.send(message.channel, {
      title: `XP Leaderboard`,
      description: topStr,
      color: 431075
    })
  }
}

module.exports = top
