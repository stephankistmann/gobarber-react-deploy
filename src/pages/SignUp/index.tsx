import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import api from '../../services/api';

import getValidationErrors from '../../utils/getValidationErrors';

import logoImg from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { useToast } from '../../hooks/toast';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Name required'),
        email: Yup.string().required('Email address required').email('Enter a valid email address'),
        password: Yup.string().min(6, 'Minimum of 6 digits')
      });

      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('/users', data);


      history.push('/');

      addToast({
        type: 'success',
        title: 'Account created!',
        description: 'You can now log-in to GoBarber!'
      });

    } catch (err) {
      if (err instanceof Yup.ValidationError) {

        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Registration error',
        description: 'An error occurred while trying to register you account, try again',
      });
    }
  }, [addToast, history]);

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Create your account</h1>

            <Input name="name" icon={FiUser} placeholder="Name" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input name="password" icon={FiLock} type="password" placeholder="Password" />

            <Button type="submit">Create</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
          Back to logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
