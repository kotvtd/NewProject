# 🎮 Cấu trúc Game Cocos (Project Skeleton)

## Tổng quan

Project được tổ chức để tách biệt rõ ràng giữa:

- **Lobby (UI menu)**
- **Room (Gameplay)**

Mục tiêu:

- Dễ mở rộng
- Dễ maintain
- Hạn chế phụ thuộc chéo (coupling)

---

## Cấu trúc Scene

```
Canvas (Root)
│
├── Lobby
│   ├── UI_StartButton
│   ├── UI_Setting
│   ├── UI_Quit
│   └── LobbyManager
│
├── Room
│   ├── CharacterLayer
│   │   └── CharacterManager
│   │
│   ├── BulletLayer
│   │   └── BulletManager
│   │
│   ├── MonsterLayer
│   │   └── MonsterManager
│   │
│   ├── BottomUI
│   │   └── UIManager
│   │
│   └── RoomManager
│
└── GameManager
```

---

## Structer

### 1. GameManager

Chịu trách nhiệm:

- Điều hướng game (Lobby ↔ Room)
- Quản lý state global (score, data player, ...)

---

### 2. LobbyManager

Chịu trách nhiệm:

- Xử lý UI:
  - Start Game
  - Setting
  - Quit

- Phát event để bắt đầu game

---

### 3. RoomManager

Chịu trách nhiệm:

- Điều phối gameplay
- Nhận và xử lý event từ các Manager khác
- Điều khiển flow game (spawn, score, trạng thái game)

---

### 4. Layer System

#### CharacterLayer

- Chứa toàn bộ node nhân vật

#### BulletLayer

- Chứa toàn bộ node đạn

#### MonsterLayer

- Chứa toàn bộ node quái

#### BottomUI

- UI trong gameplay (HP, Score, ...)

---

### 5. Manager System

Mỗi Layer sẽ có một Manager tương ứng:

| Layer          | Manager          | Chức năng chính                   |
| -------------- | ---------------- | --------------------------------- |
| CharacterLayer | CharacterManager | Di chuyển, tấn công, logic player |
| BulletLayer    | BulletManager    | Spawn và update đạn               |
| MonsterLayer   | MonsterManager   | Spawn và AI quái                  |
| BottomUI       | UIManager        | Update UI (HP, Score, ...)        |

---

## Luồng giao tiếp (Event)

### Sử dụng Event để giao tiếp giữa các hệ thống

Tránh gọi trực tiếp giữa các Manager

---

### Ví dụ luồng hoạt động

#### Player bắn đạn

```
CharacterManager
    → emit "PLAYER_SHOOT"

RoomManager
    → nhận event
    → gọi BulletManager.spawn()
```

---

#### Quái chết

```
MonsterManager
    → emit "MONSTER_DEAD"

RoomManager
    → update score
    → gọi UIManager.update()
```

---

## Nguyên tắc thiết kế

- **Tách biệt trách nhiệm**
  - Layer = hiển thị
  - Manager = xử lý logic

- **Loose Coupling**
  - Không gọi trực tiếp giữa các Manager
  - Giao tiếp bằng Event

- **Dễ mở rộng**
  - Có thể thêm:
    - Skill system
    - Effect system
    - Multiplayer

---

## Hướng phát triển thêm (Optional)

- [ ] Object Pool (tối ưu spawn Bullet, Monster)
- [ ] State Machine (Player, Enemy)
- [ ] Data-driven (config JSON)
- [ ] Sound Manager
- [ ] Save / Load Game

---

## Theo dõi tiến độ

### Lobby

- [ ] Start Button
- [ ] Setting UI
- [ ] Quit Function

### Room

- [ ] Di chuyển nhân vật
- [ ] Hệ thống bắn đạn
- [ ] Logic đạn
- [ ] Spawn quái
- [ ] Collision
- [ ] UI (HP, Score)

---

## Ghi chú

- Giữ các Manager độc lập
- Tránh phụ thuộc chéo
- Ưu tiên dùng Event thay vì gọi trực tiếp

---

## Mục tiêu

Xây dựng một kiến trúc:

- Dễ mở rộng
- Dễ debug
- Dễ maintain

---
