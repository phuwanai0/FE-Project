
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Login from './Login'
import { login } from '../services/api'

vi.mock('../services/api', () => ({
  login: vi.fn(),
}))

describe('Login Component', () => {
  const onLogin = vi.fn()
  const setPage = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('แสดงหัวข้อเข้าสู่ระบบ', () => {
    render(<Login onLogin={onLogin} setPage={setPage} />)

    expect(
      screen.getByRole('heading', { name: 'เข้าสู่ระบบ' })
    ).toBeInTheDocument()
  })

  it('แสดงช่องกรอกอีเมลและรหัสผ่าน', () => {
    render(<Login onLogin={onLogin} setPage={setPage} />)

    expect(screen.getByPlaceholderText('อีเมล')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('รหัสผ่าน')).toBeInTheDocument()
  })

  it('แสดงปุ่มสมัครสมาชิก', () => {
    render(<Login onLogin={onLogin} setPage={setPage} />)

    expect(
      screen.getByRole('button', { name: 'สมัครสมาชิก' })
    ).toBeInTheDocument()
  })

  it('กดสมัครสมาชิกแล้วเปลี่ยนหน้าเป็น register', async () => {
    const user = userEvent.setup()

    render(<Login onLogin={onLogin} setPage={setPage} />)

    await user.click(
      screen.getByRole('button', { name: 'สมัครสมาชิก' })
    )

    expect(setPage).toHaveBeenCalledWith('register')
  })

  it('กดกลับไปเลือกซื้อสินค้าแล้วเปลี่ยนหน้าเป็น shop', async () => {
    const user = userEvent.setup()

    render(<Login onLogin={onLogin} setPage={setPage} />)

    await user.click(
      screen.getByRole('button', { name: 'กลับไปเลือกซื้อสินค้า' })
    )

    expect(setPage).toHaveBeenCalledWith('shop')
  })

  it('เข้าสู่ระบบสำเร็จและบันทึก Token', async () => {
    const user = userEvent.setup()

    login.mockResolvedValue({
      token: 'test-token',
      user_id: 1,
      username: 'testuser',
      role: 'member',
    })

    render(<Login onLogin={onLogin} setPage={setPage} />)

    await user.type(
      screen.getByPlaceholderText('อีเมล'),
      'test@gmail.com'
    )

    await user.type(
      screen.getByPlaceholderText('รหัสผ่าน'),
      '123456'
    )

    await user.click(
      screen.getByRole('button', { name: 'เข้าสู่ระบบ' })
    )

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@gmail.com', '123456')
      expect(onLogin).toHaveBeenCalledTimes(1)
    })

    expect(localStorage.getItem('token')).toBe('test-token')

    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      user_id: 1,
      username: 'testuser',
      role: 'member',
    })
  })

  it('แสดง Error เมื่อเข้าสู่ระบบไม่สำเร็จ', async () => {
    const user = userEvent.setup()

    login.mockRejectedValue(
      new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    )

    render(<Login onLogin={onLogin} setPage={setPage} />)

    await user.type(
      screen.getByPlaceholderText('อีเมล'),
      'test@gmail.com'
    )

    await user.type(
      screen.getByPlaceholderText('รหัสผ่าน'),
      'wrongpassword'
    )

    await user.click(
      screen.getByRole('button', { name: 'เข้าสู่ระบบ' })
    )

    expect(
      await screen.findByText('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    ).toBeInTheDocument()
  })

  it('แสดง Error เมื่อ Backend ไม่ส่ง Token', async () => {
    const user = userEvent.setup()

    login.mockResolvedValue({
      username: 'testuser',
      role: 'member',
    })

    render(<Login onLogin={onLogin} setPage={setPage} />)

    await user.type(
      screen.getByPlaceholderText('อีเมล'),
      'test@gmail.com'
    )

    await user.type(
      screen.getByPlaceholderText('รหัสผ่าน'),
      '123456'
    )

    await user.click(
      screen.getByRole('button', { name: 'เข้าสู่ระบบ' })
    )

    expect(
      await screen.findByText('ไม่พบ Token จาก Backend')
    ).toBeInTheDocument()
  })

  it('แสดง Error เมื่อไม่พบสิทธิ์ผู้ใช้งาน', async () => {
    const user = userEvent.setup()

    login.mockResolvedValue({
      token: 'test-token',
      user_id: 1,
      username: 'testuser',
      role: 'unknown',
    })

    render(<Login onLogin={onLogin} setPage={setPage} />)

    await user.type(
      screen.getByPlaceholderText('อีเมล'),
      'test@gmail.com'
    )

    await user.type(
      screen.getByPlaceholderText('รหัสผ่าน'),
      '123456'
    )

    await user.click(
      screen.getByRole('button', { name: 'เข้าสู่ระบบ' })
    )

    expect(
      await screen.findByText('ไม่พบสิทธิ์ผู้ใช้งาน')
    ).toBeInTheDocument()

    expect(localStorage.getItem('token')).toBeNull()
  })

  it('เรียก onLogin ด้วยข้อมูลผู้ใช้เมื่อเข้าสู่ระบบสำเร็จ', async () => {
    const user = userEvent.setup()

    const userData = {
      token: 'test-token',
      user_id: 1,
      username: 'admin',
      role: 'admin',
    }

    login.mockResolvedValue(userData)

    render(<Login onLogin={onLogin} setPage={setPage} />)

    await user.type(
      screen.getByPlaceholderText('อีเมล'),
      'admin@gmail.com'
    )

    await user.type(
      screen.getByPlaceholderText('รหัสผ่าน'),
      '123456'
    )

    await user.click(
      screen.getByRole('button', { name: 'เข้าสู่ระบบ' })
    )

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith(userData)
    })
  })
})
