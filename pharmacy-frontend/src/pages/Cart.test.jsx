
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Cart from './Cart'

import {
  getCart,
  updateCartItem,
  removeCartItem,
  createOrder,
} from '../services/api'

vi.mock('../services/api', () => ({
  getCart: vi.fn(),
  updateCartItem: vi.fn(),
  removeCartItem: vi.fn(),
  createOrder: vi.fn(),
}))

describe('Cart Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    getCart.mockResolvedValue([
      {
        cart_item_id: 1,
        product_name: 'พลาสเตอร์ยา',
        price: 35,
        quantity: 2,
      },
    ])
  })

  it('แสดงหัวข้อตะกร้าสินค้า', async () => {
    render(<Cart />)

    expect(
      screen.getByText('ตะกร้าสินค้า')
    ).toBeInTheDocument()
  })

  it('แสดงสินค้าในตะกร้า', async () => {
    render(<Cart />)

    expect(
      await screen.findByText('พลาสเตอร์ยา')
    ).toBeInTheDocument()
  })

  it('แสดงราคาสินค้า', async () => {
    render(<Cart />)

    expect(
      await screen.findByText('35.00 บาท')
    ).toBeInTheDocument()
  })

  it('คำนวณราคารวมถูกต้อง', async () => {
    render(<Cart />)

    expect(
      await screen.findByText('70.00 บาท')
    ).toBeInTheDocument()
  })

  it('กดเพิ่มจำนวนสินค้าแล้วเรียก updateCartItem', async () => {
    const user = userEvent.setup()

    render(<Cart />)

    await screen.findByText('พลาสเตอร์ยา')

    await user.click(screen.getByText('+'))

    await waitFor(() => {
      expect(updateCartItem).toHaveBeenCalledWith(1, 3)
    })
  })

  it('กดลดจำนวนสินค้าแล้วเรียก updateCartItem', async () => {
    const user = userEvent.setup()

    render(<Cart />)

    await screen.findByText('พลาสเตอร์ยา')

    await user.click(screen.getByText('-'))

    await waitFor(() => {
      expect(updateCartItem).toHaveBeenCalledWith(1, 1)
    })
  })

  it('ไม่ลดจำนวนสินค้าต่ำกว่า 1', async () => {
    const user = userEvent.setup()

    getCart.mockResolvedValue([
      {
        cart_item_id: 1,
        product_name: 'พลาสเตอร์ยา',
        price: 35,
        quantity: 1,
      },
    ])

    render(<Cart />)

    await screen.findByText('พลาสเตอร์ยา')

    await user.click(screen.getByText('-'))

    expect(updateCartItem).not.toHaveBeenCalled()
  })

  it('กดลบสินค้าแล้วเรียก removeCartItem', async () => {
    const user = userEvent.setup()

    render(<Cart />)

    await screen.findByText('พลาสเตอร์ยา')

    await user.click(screen.getByText('ลบ'))

    await waitFor(() => {
      expect(removeCartItem).toHaveBeenCalledWith(1)
    })
  })

  it('แสดงข้อความเมื่อไม่มีสินค้าในตะกร้า', async () => {
    getCart.mockResolvedValue([])

    render(<Cart />)

    expect(
      await screen.findByText('ยังไม่มีสินค้าในตะกร้า')
    ).toBeInTheDocument()
  })

  it('กดยืนยันสั่งซื้อแล้วเรียก createOrder', async () => {
    const user = userEvent.setup()

    createOrder.mockResolvedValue({
      message: 'ส่งคำสั่งซื้อสำเร็จ',
    })

    render(<Cart />)

    await screen.findByText('พลาสเตอร์ยา')

    await user.click(
      screen.getByText('ยืนยันสั่งซื้อ')
    )

    await waitFor(() => {
      expect(createOrder).toHaveBeenCalledTimes(1)
    })
  })
})
