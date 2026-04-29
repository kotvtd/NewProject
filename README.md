# Game Design Patterns 
---

# 1. Singleton Pattern

##  Khái niệm

Chỉ cho phép **1 instance duy nhất tồn tại** trong toàn bộ game.

## Công dụng

* Quản lý dữ liệu global
* Truy cập từ mọi nơi

## Khi nào dùng

* GameManager
* SoundManager
* Config hệ thống

## Ví dụ

```ts
GameManager.instance.isPause;
EmitterManager.getInstance();
```

## Lưu ý

* Không lạm dụng (dễ thành “God object”)
* Khó test nếu dùng quá nhiều

---

# 2. State Pattern

## Khái niệm

Đối tượng có nhiều trạng thái, mỗi trạng thái có hành vi riêng.

## Công dụng

* Tránh if/else phức tạp
* Code rõ ràng, dễ mở rộng

## Khi nào dùng

* Player state
* Enemy AI
* Game flow

## Ví dụ

```ts
enum EnemyState {
    IDLE,
    WALK,
    ATTACK
}
```

```ts
switch(this.state) {
    case EnemyState.WALK:
        this.handleWalk();
        break;
    case EnemyState.ATTACK:
        this.handleAttack();
        break;
}
```

---

# 3. Observer Pattern (Event)

## Khái niệm

Một object phát sự kiện → nhiều object khác lắng nghe.

## Công dụng

* Giảm phụ thuộc giữa các hệ thống
* Giao tiếp linh hoạt

## Khi nào dùng

* UI update
* Spawn / chết / win / lose
* Gameplay event

## Ví dụ

```ts
this.emitter.emit("ENEMY_DIE");

this.emitter.registerEvent("ENEMY_DIE", this.onEnemyDie, this);
```

## Ưu điểm

* Dễ mở rộng
* Tách biệt hệ thống

## Nhược điểm

* Khó debug nếu quá nhiều event

---

# 4. Flyweight Pattern (Object Pool)

## Khái niệm

Tái sử dụng object thay vì tạo mới liên tục.

## Công dụng

* Giảm memory
* Tăng performance

## Khi nào dùng

* Bullet
* Enemy
* Particle

## Ví dụ

```ts
objectPool.get();
objectPool.put();
```

## ⚡ Lợi ích

* Giảm lag

---

# 5. Command Pattern

## Khái niệm

Đóng gói hành động thành object.

## Công dụng

* Tách input khỏi logic
* Hỗ trợ undo/redo
* Dễ mở rộng

## Khi nào dùng

* Input system
* Skill system
* Replay game

## Ví dụ

```ts
class AttackCommand {
    execute() {
        hero.attack();
    }
}
```

```ts
command.execute();
```

## 💡 Ứng dụng nâng cao

* Replay trận đấu
* Undo trong game chiến thuật

---

# Tổng hợp nhanh

| Pattern   | Mục đích           |
| --------- | ------------------ |
| Singleton | Quản lý global     |
| State     | Xử lý trạng thái   |
| Observer  | Giao tiếp hệ thống |
| Flyweight | Tối ưu memory      |
| Command   | Đóng gói hành động |

---

# Áp dụng vào game

| System            | Pattern   |
| ----------------- | --------- |
| GameManager       | Singleton |
| EnemyController   | State     |
| Event System      | Observer  |
| Bullet/Enemy Pool | Flyweight |
| Input / Skill     | Command   |

---

# Kết luận

5 pattern này là nền tảng để build game:

* Singleton → quản lý trung tâm
* State → điều khiển hành vi
* Observer → kết nối hệ thống
* Flyweight → tối ưu hiệu năng
* Command → xử lý hành động

 Kết hợp lại sẽ tạo thành kiến trúc game sạch, dễ scale và ít bug hơn.

---
