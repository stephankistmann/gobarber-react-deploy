import React, { useRef, useCallback, useState } from 'react';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);

      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        email: Yup.string().required('Email address is required').email('Enter a valid email address'),
      });

      await schema.validate(data, {
        abortEarly: false
      });

      await api.post('/password/forgot', {
        email: data.email
      });

      addToast({
        type: 'success',
        title: 'Recovery email sent',
        description:
          "We've sent a confirmation email to recover your password, check your email's inbox."
      });

    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Error in password recovery',
        description: 'An error occurred while recovering your password, try again.',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Forgot my password</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">Recover</Button>
          </Form>

          <Link to="/signin">
            <FiLogIn />
            Back to login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
}


export default ForgotPassword;
