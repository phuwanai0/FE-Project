
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Sidebar from './Sidebar'

describe('Sidebar Component', () => {

  it('แสดงชื่อ Pharmacy Admin', () => {
    render(
      <Sidebar activePage="Dashboard" setActivePage={vi.fn()} />
    )

    expect(screen.getByText('Pharmacy Admin')).toBeInTheDocument()
  })

  it('แสดงเมนู Dashboard', () => {
    render(
      <Sidebar activePage="Dashboard" setActivePage={vi.fn()} />
    )

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('แสดงเมนูสินค้าครบถ้วน', () => {
    render(
      <Sidebar activePage="Dashboard" setActivePage={vi.fn()} />
    )

    expect(screen.getByText('สินค้า')).toBeInTheDocument()
    expect(screen.getByText('หมวดหมู่')).toBeInTheDocument()
    expect(screen.getByText('คำสั่งซื้อ')).toBeInTheDocument()
    expect(screen.getByText('สมาชิก')).toBeInTheDocument()
  })

  it('มีปุ่มเมนูทั้งหมด 5 ปุ่ม', () => {
    render(
      <Sidebar activePage="Dashboard" setActivePage={vi.fn()} />
    )

    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('คลิก Dashboard แล้วเรียก setActivePage', async () => {
    const user = userEvent.setup()
    const setActivePage = vi.fn()

    render(
      <Sidebar activePage="สินค้า" setActivePage={setActivePage} />
    )

    await user.click(screen.getByText('Dashboard'))

    expect(setActivePage).toHaveBeenCalledWith('Dashboard')
  })

  it('คลิกคำสั่งซื้อแล้วเปลี่ยนหน้า', async () => {
    const user = userEvent.setup()
    const setActivePage = vi.fn()

    render(
      <Sidebar activePage="Dashboard" setActivePage={setActivePage} />
    )

    await user.click(screen.getByText('คำสั่งซื้อ'))

    expect(setActivePage).toHaveBeenCalledWith('คำสั่งซื้อ')
  })

  it('เมนูที่เลือกมีสีพื้นหลัง bg-blue-600', () => {
    render(
      <Sidebar activePage="สินค้า" setActivePage={vi.fn()} />
    )

    expect(screen.getByText('สินค้า').className).toContain('bg-blue-600')
    expect(screen.getByText('Dashboard').className).not.toContain('bg-blue-600')
  })

})
