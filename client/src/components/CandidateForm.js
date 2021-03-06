import React from 'react'
import { Field, reduxForm } from 'redux-form'

class CandidateForm extends React.Component {
  renderError = ({ error, touched, active }) => {
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      )
    }
  }

  renderServerErr = () => {
    if (this.props.errMsg) {
      return (
        <div className="ui error message">
          <div className="header">{this.props.errMsg}</div>
        </div>
      )
    }
  }

  renderInput = ({ input, label, placeholder, meta, type }) => {
    let className = 'required field'
    if (meta.error && meta.touched) {
      className = 'required field error'
    }
    if (label === 'Additional support items' || label === 'Company Name in Chinese' || label === 'News/Media link') {
      className = 'field'
    }
    return (
      <div className={className}>
        <label>{label}</label>
        <input
          {...input}
          plazceholder={placeholder}
          autoComplete="off"
          type={type}
          className={this.props.classForInput ? this.props.classForInput : ''}
        />
        {this.renderError(meta)}
      </div>
    )
  };

  onSubmit = (formValues) => {
    this.props.onSubmit(formValues)
  }

  render () {
    return (
      <div className="candidate-form">
        <div className="ui grid container">
          <div className="five wide column"></div>
          <div className="six wide column">

            <form className="ui form error" onSubmit={this.props.handleSubmit(this.onSubmit)}>
              <div className="ui huge header">{this.props.header}</div>
              <div className="ui medium header">Basic Information</div>
              <Field
                name="companyNameEn"
                component={this.renderInput}
                label="Company Name in English"
                placeholder=""
                type="text"
              />
              <Field
                name="companyNameChi"
                component={this.renderInput}
                label="Company Name in Chinese"
                placeholder=""
                type="text"
              />
              <Field
                name="companyEmail"
                component={this.renderInput}
                label="Contact Email"
                placeholder=""
                type="tel"
              />
              <div className="ui medium header">
                Supporting Resource for Review
              </div>
              <Field
                name="website"
                component={this.renderInput}
                label="Company Website"
                placeholder=""
                type="text"
              />
              <Field
                name="news"
                component={this.renderInput}
                label="News/Media link"
                placeholder=""
                type="text"
              />
              <Field
                name="other"
                component={this.renderInput}
                label="Additional support items"
                placeholder=""
                type="text"
              />

              <button className='ui button' type="submit">Submit</button>

              {this.renderServerErr()}
            </form>
          </div>
          <div className="five wide column"></div>
        </div>
      </div>
    )
  }
}

const validate = (formValues) => {
  const errors = {}
  if (!formValues.companyNameEn) {
    errors.companyNameEn = 'Please enter an English company name.'
  }
  if (!formValues.companyNameChi) {
    errors.companyNameChi = 'Please enter a Chinese company name.'
  }
  // if (formValues.companyNameChi && !formValues.companyNameChi.match(/[\u3400-\u9FBF]/)) {
  //   errors.companyNameChi = "Please enter a company name in Chinese."
  // }
  if (!formValues.website) {
    errors.website = 'Please provide a website.'
  }
  if (!formValues.news) {
    errors.news = 'Please provide a news.'
  }
  if (!formValues.companyEmail) {
    errors.companyEmail = 'Please enter an email.'
  }
  // eslint-disable-next-line no-useless-escape
  if (formValues.companyEmail && !formValues.companyEmail.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    errors.companyEmail = 'Please enter a valid email.'
  }

  return errors
}

export default reduxForm({
  form: 'candidateForm',
  validate
})(CandidateForm)
