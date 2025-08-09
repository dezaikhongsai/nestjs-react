# Backend Quản lý tài chính cá nhân tích hợp AI

## Các công nghệ sử dụng

- Nestjs
- Postgress + Redis
- Prisma
- Docker

## Phạm vi

- Xây dựng backend tích hợp cho web (admin dashboard) + mobile (user)

### Xây dựng chức năng đăng nhập, đăng ký người dùng + phân quyền

1. Đăng ký

- Cơ chế xác thực thông qua gửi mã otp qua email

2. Đăng nhập

- Cơ chế authentication, accessToken + refreshToken

3. Phân quyền (Role base access controll -- RBAC)

- Tạo decorator cho role (phân quyền)
- Chia tách public route và private route ( public / jwt )

### Xây dựng tính năng quản lý người dùng

- CRUD user
- Đổi mật khẩu xác thực qua OTP (Chưa làm)
