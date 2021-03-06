import Candidate from './model'
import User from '../user/model'
import Email from './email'
import Company from '../company/model'
import _ from 'lodash'

export default {
  create: async (req, res) => {
    console.log('here in candidate create', req.body.formValues)
    const data = req.body.formValues
    const user = req.user
    try {
      const foundCandi = await Candidate.findOne({ website: data.website })
      console.log('foundCandi', foundCandi)
      if (foundCandi) {
        res.status(500).json({ message: 'This company already exists. Please contact the customer service for more detail.' })
      }
    } catch (err) {
      console.log('in err')
      console.log(err)
      res.status(500).json({ message: 'Something went wrong' })
    }
    console.log('create candi and user')
    try {
      console.log('user in create', user)
      const createdComp = await Candidate.create({ ...data, approve_status: false, applicant: user._id })
      const updatedUser = await User.findByIdAndUpdate(user._id, { candidate: createdComp._id })
      console.log('updated user', updatedUser)
      res.status(200).json({ candidate: createdComp })
    } catch (err) {
      res.status(500).json({ message: 'something went wrong' })
    }
  },
  show: async (req, res) => {
    console.log('hii there')
    console.log(req.params)
    const CandiId = req.params.id

    try {
      const foundCandi = await Candidate.findById(CandiId)
      console.log(foundCandi)
      if (!foundCandi) {
        res.status(500).json({ message: 'There is no application under this user.' })
      }

      console.log('yesss')
      res.status(200).json({ candidate: foundCandi })
    } catch {
      res.status(500).json({ message: 'Something went wrong.' })
    }
  },
  showAll: async (req, res) => {
    console.log(req.user)
    console.log('in showall')
    try {
      const allCandidate = await Candidate.find().populate('approver')
      console.log(allCandidate)
      res.status(200).json({ candidates: allCandidate })
    } catch (err) {
      res.status(500).json({ message: 'something went wrong' })
    }
  },
  edit: async (req, res) => {
    console.log('in edit candidtate')
    const candidateId = req.params.id
    const candidateData = req.body.formValues
    try {
      const editedCandi = await Candidate.findByIdAndUpdate(candidateId, candidateData)
      res.status(200).json({ candidate: editedCandi })
    } catch (err) {
      res.status(500).json({ message: 'something went wrong' })
    }
  },
  approve: async (req, res) => {
    console.log('hii in approve')
    try {
      const foundCandi = await Candidate.findById(req.params.id).populate('applicant')

      const sendToName = foundCandi.applicant.name
      const email = foundCandi.applicant.email
     
      try {
        const updatedCandi = await Candidate.findByIdAndUpdate(req.params.id, { approve_status: true, approver: req.body.approverId }, { new: true })
        const allCandidate = await Candidate.find().populate('approver')
        const newCompany = _.pick(updatedCandi, ['companyNameEn', 'companyNameChi', 'companyEmail', 'website'])
        const createdComp = await Company.create(newCompany)
        createdComp.owners.push(updatedCandi.applicant)
        createdComp.candidate = updatedCandi._id
        createdComp.executives.push({}, {}, {})
        await createdComp.save()
        await User.findByIdAndUpdate(updatedCandi.applicant)
        const compId = createdComp._id
        if (process.env.NODE_ENV === 'production') {
          await Email.send(email, sendToName, compId)
        }
        try {
          console.log('applicantId', foundCandi.applicant._id)
          res.status(200).json({ candidates: allCandidate, candidate: updatedCandi })
        } catch (err) {
          console.log(err)
          res.status(500).json({ message: 'something is wrong when updating User' })
        }
      } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'something is wrong when updating Candidate' })
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: 'something is wrong sending email' })
    }
  }
}
