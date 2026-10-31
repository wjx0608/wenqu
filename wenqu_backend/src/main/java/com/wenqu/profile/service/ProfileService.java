package com.wenqu.profile.service;

import com.wenqu.profile.api.dto.ProfilePatchRequest;
import com.wenqu.profile.api.dto.ProfileResponse;
import com.wenqu.user.domain.User;

import java.util.Optional;

/**
 * 个人资料业务接口。
 */
public interface ProfileService {

    Optional<User> getById(long userId);

    ProfileResponse updateProfile(long userId, ProfilePatchRequest req);

    ProfileResponse updateAvatar(long userId, String avatarUrl);
}