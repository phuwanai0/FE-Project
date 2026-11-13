
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from './Navbar'

describe('Navbar Component', () => {
  it('แสดงชื่อ Pharmacy', () => {
    render(<Navbar user={null} setPage={vi.fn()} onLogout={vi.fn()} />)
    expect(screen.getByText('Pharmacy')).toBeInTheDocument()
  })

  it('แสดงปุ่มเข้าสู่ระบบและสมัครสมาชิก', () => {
    render(<Navbar user={null} setPage={vi.fn()} onLogout={vi.fn()} />)
    expect(screen.getByText('เข้าสู่ระบบ')).toBeInTheDocument()
    expect(screen.getByText('สมัครสมาชิก')).toBeInTheDocument()
  })

  it('กดเข้าสู่ระบบแล้วเปลี่ยนหน้าเป็น login', async () => {
    const user = userEvent.setup()
    const setPage = vi.fn()

    render(<Navbar user={null} setPage={setPage} onLogout={vi.fn()} />)
    await user.click(screen.getByText('เข้าสู่ระบบ'))

    expect(setPage).toHaveBeenCalledWith('login')
  })

  it('แสดงชื่อสมาชิกและเมนูตะกร้า', () => {
    render(
      <Navbar
        user={{ username: 'testuser', role: 'member' }}
        setPage={vi.fn()}
        onLogout={vi.fn()}
      />
    )

    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('ตะกร้า')).toBeInTheDocument()
  })

  it('สมาชิกกดตะกร้าแล้วเปลี่ยนหน้าเป็น cart', async () => {
    const user = userEvent.setup()
    const setPage = vi.fn()

    render(
      <Navbar
        user={{ username: 'testuser', role: 'member' }}
        setPage={setPage}
        onLogout={vi.fn()}
      />
    )

    await user.click(screen.getByText('ตะกร้า'))
    expect(setPage).toHaveBeenCalledWith('cart')
  })

  it('แสดงเมนูจัดการร้านค้าเฉพาะ Admin', () => {
    render(
      <Navbar
        user={{ username: 'admin', role: 'admin' }}
        setPage={vi.fn()}
        onLogout={vi.fn()}
      />
    )

    expect(screen.getByText('จัดการร้านค้า')).toBeInTheDocument()
    expect(screen.queryByText('ตะกร้า')).not.toBeInTheDocument()
  })

  it('กดออกจากระบบแล้วเรียก onLogout', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()

    render(
      <Navbar
        user={{ username: 'testuser', role: 'member' }}
        setPage={vi.fn()}
        onLogout={onLogout}
      />
    )

    await user.click(screen.getByText('ออกจากระบบ'))
    expect(onLogout).toHaveBeenCalledTimes(1)
  })
})
