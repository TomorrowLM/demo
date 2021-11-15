import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { useHistory } from 'react-router-dom'
import { Typography, styled, TextField, Button } from '@material-ui/core'
import { getStaticText } from '../../../utils'
import { MappingControl } from '../../../components'

const formSchema = {
  profileName: Yup.string().required(
    getStaticText(
      'page.data.source.profile.form.validate.profile.name.required'
    )
  ),
  sourceName: Yup.string().required(
    getStaticText('page.data.source.profile.form.validate.source.name.required')
  )
}

const FormItem = styled('div')(({ theme }) => ({
  margin: `${theme.spacing(1.5)}px 0`
}))

const BasicInfo = (props) => {
  const { StaticText } = React
  const {
    basicInfo,
    onSubmit,
    onReset,
    connectionName,
    channelName,
    step: { setStep, currentStep }
  } = props
  const history = useHistory()
  const handleCancel = () => {
    onReset({})
    history.push('data-source-profile/list')
  }

  return (
    <>
      <Typography color="primary" variant="h5">
        <StaticText langKey="page.data.source.profile.basic.info.title" />
      </Typography>
      <Formik
        validationSchema={Yup.object().shape(formSchema)}
        initialValues={basicInfo}
        onSubmit={(values) => {
          onSubmit(values)
          setStep(currentStep + 1)
        }}
      >
        {({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Field name="profileName">
                {({ field, meta }) => {
                  return (
                    <FormItem>
                      <TextField
                        label={getStaticText(
                          'page.data.source.profile.basic.info.profile.name'
                        )}
                        id="profileName"
                        style={{ minWidth: 400 }}
                        error={meta.error && meta.touched}
                        helperText={meta.touched && meta.error}
                        {...field}
                      />
                    </FormItem>
                  )
                }}
              </Field>
              <Field name="sourceName">
                {({ field, meta }) => {
                  return (
                    <FormItem>
                      <TextField
                        label={getStaticText(
                          'page.data.source.profile.basic.info.source.name'
                        )}
                        id="sourceName"
                        style={{ minWidth: 400 }}
                        error={meta.error && meta.touched}
                        helperText={meta.touched && meta.error}
                        {...field}
                      />
                    </FormItem>
                  )
                }}
              </Field>
              <FormItem>
                <MappingControl
                  dataSource={{
                    label: getStaticText(
                      'page.data.source.profile.basic.info.ext'
                    ),
                    value: `${channelName} - ${connectionName}`
                  }}
                />
              </FormItem>
              <FormItem>
                <Button onClick={handleCancel}>
                  {getStaticText('page.data.source.profile.button.cancel')}
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  {getStaticText('page.data.source.profile.button.next')}
                </Button>
              </FormItem>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

BasicInfo.propTypes = {
  basicInfo: PropTypes.shape({
    profileName: PropTypes.string.isRequired,
    sourceName: PropTypes.string.isRequired
  }).isRequired,
  connectionName: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  step: PropTypes.shape({
    setStep: PropTypes.func.isRequired,
    currentStep: PropTypes.number.isRequired
  }).isRequired
}

export default BasicInfo
