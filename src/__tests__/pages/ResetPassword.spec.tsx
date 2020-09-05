import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';
import { render, fireEvent, waitFor } from '@testing-library/react';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();
// const mockedResetPassword = jest.fn();
const mockedToken = "?token=new-token";
const mockedApi = new MockAdapter(api);

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => ({
      search: mockedToken
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  })

  it('should be able to reset the password', async () => {

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    mockedApi.onPost('/password/reset').replyOnce(200);

    const passwordField = getByPlaceholderText('Nova senha');
    const confirmationPasswordField = getByPlaceholderText('Confirmação da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '1234567' } });
    fireEvent.change(confirmationPasswordField, { target: { value: '1234567' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to reset the password if the confirmation password is not the same as password', async () => {

    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    mockedApi.onPost('/password/reset').replyOnce(200);

    const passwordField = getByPlaceholderText('Nova senha');
    const confirmationPasswordField = getByPlaceholderText('Confirmação da senha');
    const buttonElement = getByText('Alterar senha');

    fireEvent.change(passwordField, { target: { value: '1234567' } });
    fireEvent.change(confirmationPasswordField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });
});
