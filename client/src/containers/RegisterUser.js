import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
    Button,
    ButtonGroup,
    Container,
    Form,
    FormFeedback,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap';
import {
    Typeahead
} from 'react-bootstrap-typeahead'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next'
import countries, { postalCodeRequired } from '../lib/countries'
import provinces from 'provinces'
import postalCodes from 'postal-codes-js'

import { register as registerUser } from '../actions/authActions';
import { clearErrors } from '../actions/errorActions';

function RegisterUser() {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
    const error = useSelector(state => state.error)

    const history = useHistory()

    const { t, i18n } = useTranslation('commonForms')

    const dispatch = useDispatch()

    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ country, setCountry ] = useState('')
    const [ countryOptions, setCountryOptions ] = useState([])
    const [ province, setProvince ] = useState([])
    const [ provinceOptions, setProvinceOptions ] = useState([])
    const [ postalCode, setPostalCode ] = useState('')
    const [ msg, setMsg ] = useState(null)
    const [ language, setLanguage ] = useState('en')

    const { register, handleSubmit, setError, errors } = useForm()

    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        dispatch(clearErrors())
        if (country.length === 0) {
            setError("country","required",t('invalidRequired'))
            return
        }
        if (provinceOptions.length > 0 && province.length === 0) {
            setError("province","required",t('invalidRequired'))
            return
        }
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            country: country[0].id,
            province: province[0] ? province[0].id : '',
            postalCode
        }
        dispatch(registerUser(newUser))
    }

    useEffect(() => {
        const newLanguage = i18n.language ? i18n.language.substring(0,2) : 'en'
        if ( newLanguage !== language ) {
            setLanguage(newLanguage)
        }
    },[setLanguage,i18n,language])

    useEffect(() => {
        const newOptions = countries.getNames(language)
        setCountryOptions(Object.keys(newOptions).map((code) => {
            return { 
                id: code,
                label: newOptions[code]
            }
        }))
    }, [language,setCountryOptions])

    useEffect(() => {
        const newOptions = country.length > 0 ? provinces.filter((p) => p.country === country[0].id) : []
        setProvinceOptions(newOptions.map((p) => {
            return {
                id: p.name,
                label: p.name
            }
        }))
    },[country])

    useEffect(() => {
        if (error.id === 'REGISTER_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg(null)
        }
    }, [error] )

    useEffect(() => {
        if (isAuthenticated) {
            history.push("/")
        }
    }, [isAuthenticated,history])

    return <div>
        <Container>
            <h2>{t('AppNavbar:register')}</h2>
            {msg ? <Alert color="danger">{msg}</Alert> : null }
            <Form
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormGroup>
                    <Label for="firstName">{t('firstName')}</Label>
                    <Input
                        type="text"
                        name="firstName"
                        id="firstName"
                        placeholder={t('firstName')}
                        innerRef={register({required: true})}
                        onChange={onChange(setFirstName)}
                        invalid={errors.firstName ? true : false}
                    />
                    {errors.firstName && errors.firstName.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="lastName">{t('lastName')}</Label>
                    <Input
                        type="text"
                        name="lastName"
                        id="lastName"
                        placeholder={t('lastName')}
                        innerRef={register({required: true})}
                        onChange={onChange(setLastName)}
                        invalid={errors.lastName ? true : false}
                    />
                    {errors.lastName && errors.lastName.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="email">{t('email')}</Label>
                    <Input
                        type="email"
                        name="email"
                        id="email"
                        placeholder={t('emailPlaceholder')}
                        innerRef={register({required: true})}
                        onChange={onChange(setEmail)}
                        invalid={errors.email ? true : false}
                    />
                    {errors.email && errors.email.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="password">{t('password')}</Label>
                    <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder={t('password')}
                        innerRef={register({required: true})}
                        onChange={onChange(setPassword)}
                        invalid={errors.password ? true : false}
                    />
                    {errors.password && errors.password.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                <FormGroup>
                    <Label for="country">{t('country')}</Label>
                    <Typeahead
                        id="country"
                        name="country"
                        selected={country}
                        placeholder={t('countryPlaceholder')}
                        options={countryOptions}
                        onChange={(selected) => setCountry(selected)}
                        isInvalid={errors.country ? true : false}
                    />
                    {errors.country && <Input type="hidden" invalid />}
                    {errors.country && errors.country.type === 'required' &&
                        <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                </FormGroup>
                { (provinceOptions.length > 0) ?
                    <FormGroup>
                        <Label for="province">{t('province')}</Label>
                        <Typeahead
                            id="province"
                            name="province"
                            selected={province}
                            placeholder={t('provincePlaceholder')}
                            options={provinceOptions}
                            onChange={(selected) => setProvince(selected)}
                            isInvalid={errors.province ? true : false}
                        />
                        {errors.province && <Input type="hidden" invalid />}
                        {errors.province && errors.province.type === 'required' &&
                            <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                    </FormGroup>
                : '' }
                { country[0] ?
                    <FormGroup>
                        <Label for="postalCode">{t('postalCode')}</Label>
                        <Input
                            type="text"
                            name="postalCode"
                            id="postalCode"
                            placeholder={t('postalCode')}
                            innerRef={register({
                                required: postalCodeRequired.includes(country[0].id),
                                validate: ((postalCode) => {
                                    return postalCodes.validate(country[0].id,postalCode) === true
                                })
                            })}
                            onChange={onChange(setPostalCode)}
                            invalid={errors.postalCode ? true : false}
                        />
                        {errors.postalCode && errors.postalCode.type === 'required' &&
                            <FormFeedback>{t('commonForms:invalidRequired')}</FormFeedback>}
                        {errors.postalCode && errors.postalCode.type === 'validate' &&
                            <FormFeedback>{t('commonForms:postalCodeInvalid',{country: country[0].label})}</FormFeedback>}
                    </FormGroup>
                    : '' }
                <ButtonGroup>
                    <Button
                        color="primary"
                        block
                    >{t('AppNavbar:register')}</Button>
                </ButtonGroup>
            </Form>
        </Container>
    </div>
}

export default RegisterUser;