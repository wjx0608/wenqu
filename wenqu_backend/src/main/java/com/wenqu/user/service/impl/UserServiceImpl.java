package com.wenqu.user.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

import com.wenqu.user.service.UserService;
import com.wenqu.user.mapper.UserMapper;
import com.wenqu.user.domain.User;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    /**
     * 标识脱敏：手机号保留前 3 后 4，邮箱保留 @ 前首字符。
     */
    private static String maskIdentifier(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        if (value.contains("@")) {
            int at = value.indexOf('@');
            return value.substring(0, Math.min(1, at)) + "***" + value.substring(at);
        }
        if (value.length() < 7) {
            return value;
        }
        return value.substring(0, 3) + "****" + value.substring(value.length() - 4);
    }

    /**
     * 根据手机号查询用户。
     *
     * @param phone 手机号。
     * @return 用户 Optional。
     */
    @Transactional(readOnly = true)
    public Optional<User> findByPhone(String phone) {
        return Optional.ofNullable(userMapper.findByPhone(phone));
    }

    /**
     * 根据邮箱查询用户。
     *
     * @param email 邮箱地址。
     * @return 用户 Optional。
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(userMapper.findByEmail(email));
    }

    /**
     * 根据 ID 查询用户。
     *
     * @param id 用户 ID。
     * @return 用户 Optional。
     */
    @Transactional(readOnly = true)
    public Optional<User> findById(long id) {
        return Optional.ofNullable(userMapper.findById(id));
    }

    /**
     * 判断手机号是否存在。
     *
     * @param phone 手机号。
     * @return 是否存在。
     */
    @Transactional(readOnly = true)
    public boolean existsByPhone(String phone) {
        boolean exists = userMapper.existsByPhone(phone);
        // 注意：SELECT EXISTS 的行数恒为 1，真正的结果在这个布尔值上
        log.debug("existsByPhone({}) -> {}", maskIdentifier(phone), exists);
        return exists;
    }

    /**
     * 判断邮箱是否存在。
     *
     * @param email 邮箱地址。
     * @return 是否存在。
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        boolean exists = userMapper.existsByEmail(email);
        log.debug("existsByEmail({}) -> {}", maskIdentifier(email), exists);
        return exists;
    }

    /**
     * 创建用户，写入创建与更新时间并持久化。
     *
     * @param user 待创建的用户实体。
     * @return 持久化后的用户实体。
     */
    @Transactional
    public User createUser(User user) {
        Instant now = Instant.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userMapper.insert(user);
        return user;
    }

    /**
     * 更新用户密码哈希并写入更新时间。
     *
     * @param user 用户实体（需包含 ID 与新的 passwordHash）。
     */
    @Transactional
    public void updatePassword(User user) {
        user.setUpdatedAt(Instant.now());
        userMapper.updatePassword(user.getId(), user.getPasswordHash());
    }
}
