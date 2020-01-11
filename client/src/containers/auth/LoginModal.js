import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';

function LoginModal() {
    const [modal, setModal] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState(null)

    const error = useSelector(state => state.error)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
 
    const dispatch = useDispatch()
    
    const { t } = useTranslation('AppNavbar')

    const toggle = useCallback(() => {
        dispatch(clearErrors())
        setModal(!modal)
    }, [dispatch,modal])
    const onChange = (setter) => (e) => {
        setter(e.target.value)
    }
    const onSubmit = (e) => {
        e.preventDefault()
        const user = {
            email,
            password
        }
        dispatch(clearErrors())
        dispatch(login(user))
    }

   useEffect(() => {
        if (error.id === 'LOGIN_FAIL') {
            setMsg(error.msg.msg)
        } else {
            setMsg(null)
        }
    },[error])

    useEffect(() => {
        if (modal) {
            if (isAuthenticated) {
                toggle()
            }
        }
    },[modal,isAuthenticated,toggle])

    return <div>
        <NavLink onClick={toggle} href="#">
            {t('login')}
        </NavLink>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>{t('login')}</ModalHeader>
            {msg ? <Alert color="danger">{msg}</Alert> : null }
            <ModalBody>
                <Form onSubmit={onSubmit}>
                    <FormGroup>
                        <Label for="email">{t('commonForms:email')}</Label>
                        <Input
                            type="email"
                            name="email"
                            id="email"
                            placeholder={t('commonForms:emailPlaceholder')}
                            onChange={onChange(setEmail)}
                            className="mb-3"
                        />
                        <Label for="password">{t('commonForms:password')}</Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder={t('commonForms:password')}
                            onChange={onChange(setPassword)}
                            className="mb-3"
                        />
                        <Button
                            color="dark"
                            style={{marginTop: '2rem'}}
                            block
                        >{t('login')}</Button>
                    </FormGroup>
                </Form>
            </ModalBody>
        </Modal>
    </div>
}

LoginModal.propTypes = {
    isAuthenticated: PropTypes.bool
}

export default LoginModal;