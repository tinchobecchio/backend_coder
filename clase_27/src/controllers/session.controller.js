export const destroySession = (req,res,next) => {
    if(req.session) {
        req.session.destroy(() => res.redirect('/'))
    }
}

export const current = (req,res) => {
    if(req.user) {
      return res.status(200).send(req.user)
    } else {
      return res.status(200).json({message: 'No user found'})
    }
}