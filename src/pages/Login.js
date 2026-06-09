import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaEye, FaEyeSlash, FaLeaf, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #f8fafc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 24px;
  border: 1.5px solid #d1fae5;
  padding: 40px 36px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(22,163,74,0.10);
  animation: ${fadeIn} 0.35s ease;

  @media (max-width: 480px) { padding: 28px 20px; }
`;

const LogoRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 28px;
  gap: 8px;
`;

const LogoIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #16a34a, #22c55e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  box-shadow: 0 4px 16px rgba(22,163,74,0.25);
`;

const Brand = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #15803d, #16a34a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Sub = styled.p`
  margin: 0;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;

const Heading = styled.h2`
  margin: 0 0 4px;
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  text-align: center;
`;

const HeadingSub = styled.p`
  margin: 0 0 24px;
  font-size: 13px;
  color: #64748b;
  text-align: center;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  background: #f1f5f9;
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  border: none;
  border-radius: 8px;
  padding: 9px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  color: ${({ $active }) => ($active ? '#15803d' : '#94a3b8')};
  box-shadow: ${({ $active }) => ($active ? '0 1px 4px rgba(0,0,0,0.08)' : 'none')};
`;

const FieldWrap = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const InputWrap = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px 14px;
  padding-right: ${({ $hasIcon }) => ($hasIcon ? '40px' : '14px')};
  border-radius: 10px;
  border: 1.5px solid ${({ $error }) => ($error ? '#ef4444' : '#e2e8f0')};
  font-size: 14px;
  background: #fafafa;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #16a34a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  }
  &::placeholder { color: #b0bec5; }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  &:hover { color: #15803d; }
`;

const ErrMsg = styled.p`
  font-size: 11px;
  color: #ef4444;
  margin: 4px 0 0;
  font-weight: 600;
`;

const SubmitBtn = styled.button`
  width: 100%;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #15803d 0%, #22c55e 100%);
  color: #fff;
  padding: 13px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 14px rgba(22,163,74,0.22);
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22,163,74,0.30); }
  &:active { transform: scale(0.99); }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0;
  span { font-size: 12px; color: #cbd5e1; white-space: nowrap; }
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
`;

const SocialRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
`;

const SocialBtn = styled.button`
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  padding: 10px;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s;
  &:hover { background: #f8fafc; border-color: #cbd5e1; }
`;

const BottomText = styled.p`
  text-align: center;
  font-size: 13px;
  color: #64748b;
  margin: 18px 0 0;
  a { color: #16a34a; font-weight: 700; text-decoration: none; &:hover { text-decoration: underline; } }
`;

const CheckRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  margin-bottom: 16px;
  input { margin-top: 2px; accent-color: #16a34a; }
  a { color: #16a34a; font-weight: 600; text-decoration: none; }
`;

const SuccessBanner = styled.div`
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: #15803d;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState('login');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});

  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirm: '', agree: false });
  const [signupErrors, setSignupErrors] = useState({});

  const validateLogin = () => {
    const errs = {};
    if (!loginForm.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(loginForm.email)) errs.email = 'Enter a valid email';
    if (!loginForm.password) errs.password = 'Password is required';
    else if (loginForm.password.length < 6) errs.password = 'Min 6 characters';
    return errs;
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupForm.name.trim()) errs.name = 'Full name is required';
    if (!signupForm.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(signupForm.email)) errs.email = 'Enter a valid email';
    if (!signupForm.password) errs.password = 'Password is required';
    else if (signupForm.password.length < 6) errs.password = 'Min 6 characters';
    if (signupForm.password !== signupForm.confirm) errs.confirm = 'Passwords do not match';
    if (!signupForm.agree) errs.agree = 'You must agree to the terms';
    return errs;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }
    setLoginErrors({});
    
    // 🔥 Save user to auth context
    login({ name: 'User', email: loginForm.email, phone: '', address: '' });
    setSuccess('Signed in successfully! Redirecting...');
    setTimeout(() => navigate('/account'), 1200);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const errs = validateSignup();
    if (Object.keys(errs).length) { setSignupErrors(errs); return; }
    setSignupErrors({});
    
    // 🔥 Save user to auth context with name
    login({ name: signupForm.name, email: signupForm.email, phone: '', address: '' });
    setSuccess('Account created! Welcome to Organic Store 🎉');
    setTimeout(() => navigate('/account'), 1500);
  };

  return (
    <Page>
      <Card>
        <LogoRow>
          <LogoIcon>🌿</LogoIcon>
          <Brand>Organic Store</Brand>
          <Sub>Fresh from Farm</Sub>
        </LogoRow>

        <Heading>{tab === 'login' ? 'Welcome Back!' : 'Create Account'}</Heading>
        <HeadingSub>
          {tab === 'login'
            ? 'Sign in to your account to continue shopping'
            : 'Join us for the freshest organic produce'}
        </HeadingSub>

        <Tabs>
          <Tab $active={tab === 'login'} onClick={() => { setTab('login'); setSuccess(''); }}>Sign In</Tab>
          <Tab $active={tab === 'signup'} onClick={() => { setTab('signup'); setSuccess(''); }}>Register</Tab>
        </Tabs>

        {success && <SuccessBanner><FaCheckCircle /> {success}</SuccessBanner>}

        {tab === 'login' ? (
          <>
            <SocialRow>
              <SocialBtn type="button">
                <img src="https://www.google.com/favicon.ico" width={14} alt="G" />
                Google
              </SocialBtn>
              <SocialBtn type="button">
                <img src="https://www.facebook.com/favicon.ico" width={14} alt="fb" />
                Facebook
              </SocialBtn>
            </SocialRow>

            <Divider><span>or sign in with email</span></Divider>

            <form onSubmit={handleLogin} noValidate>
              <FieldWrap>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={loginForm.email}
                  $error={loginErrors.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                />
                {loginErrors.email && <ErrMsg>{loginErrors.email}</ErrMsg>}
              </FieldWrap>

              <FieldWrap>
                <Label>Password</Label>
                <InputWrap>
                  <Input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    $error={loginErrors.password}
                    $hasIcon
                    onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <EyeBtn type="button" onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </EyeBtn>
                </InputWrap>
                {loginErrors.password && <ErrMsg>{loginErrors.password}</ErrMsg>}
              </FieldWrap>

              <SubmitBtn type="submit">Sign In →</SubmitBtn>
            </form>

            <BottomText>
              New here? <a href="#r" onClick={e => { e.preventDefault(); setTab('signup'); }}>Create an account</a>
            </BottomText>
          </>
        ) : (
          <>
            <form onSubmit={handleSignup} noValidate>
              <FieldWrap>
                <Label>Full Name</Label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={signupForm.name}
                  $error={signupErrors.name}
                  onChange={e => setSignupForm(f => ({ ...f, name: e.target.value }))}
                />
                {signupErrors.name && <ErrMsg>{signupErrors.name}</ErrMsg>}
              </FieldWrap>

              <FieldWrap>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={signupForm.email}
                  $error={signupErrors.email}
                  onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                />
                {signupErrors.email && <ErrMsg>{signupErrors.email}</ErrMsg>}
              </FieldWrap>

              <FieldWrap>
                <Label>Password</Label>
                <InputWrap>
                  <Input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Min 6 characters"
                    value={signupForm.password}
                    $error={signupErrors.password}
                    $hasIcon
                    onChange={e => setSignupForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <EyeBtn type="button" onClick={() => setShowPwd(v => !v)}>
                    {showPwd ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </EyeBtn>
                </InputWrap>
                {signupErrors.password && <ErrMsg>{signupErrors.password}</ErrMsg>}
              </FieldWrap>

              <FieldWrap>
                <Label>Confirm Password</Label>
                <InputWrap>
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-enter password"
                    value={signupForm.confirm}
                    $error={signupErrors.confirm}
                    $hasIcon
                    onChange={e => setSignupForm(f => ({ ...f, confirm: e.target.value }))}
                  />
                  <EyeBtn type="button" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </EyeBtn>
                </InputWrap>
                {signupErrors.confirm && <ErrMsg>{signupErrors.confirm}</ErrMsg>}
              </FieldWrap>

              <CheckRow>
                <input
                  type="checkbox"
                  checked={signupForm.agree}
                  onChange={e => setSignupForm(f => ({ ...f, agree: e.target.checked }))}
                />
                I agree to the <a href="#t">&nbsp;Terms of Service</a>&nbsp;and&nbsp;<a href="#p">Privacy Policy</a>
              </CheckRow>
              {signupErrors.agree && <ErrMsg style={{ marginTop: -10, marginBottom: 12 }}>{signupErrors.agree}</ErrMsg>}

              <SubmitBtn type="submit">Create Account →</SubmitBtn>
            </form>

            <BottomText>
              Already have an account? <a href="#l" onClick={e => { e.preventDefault(); setTab('login'); }}>Sign in</a>
            </BottomText>
          </>
        )}

        <BottomText style={{ marginTop: 12, fontSize: 12 }}>
          <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>← Back to Home</Link>
        </BottomText>
      </Card>
    </Page>
  );
}