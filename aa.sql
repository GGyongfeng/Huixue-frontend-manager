-- 修改天津数据库
ALTER TABLE tj_education_system.tutor_orders 
MODIFY COLUMN `teaching_type` enum('一对一','一对多') COLLATE utf8mb4_unicode_ci NULL COMMENT '教学类型',
ADD COLUMN `original_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '原始文本';

-- 修改北京数据库
ALTER TABLE bj_education_system.tutor_orders 
MODIFY COLUMN `teaching_type` enum('一对一','一对多') COLLATE utf8mb4_unicode_ci NULL COMMENT '教学类型',
ADD COLUMN `original_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '原始文本';

-- 修改武汉数据库
ALTER TABLE wh_education_system.tutor_orders 
MODIFY COLUMN `teaching_type` enum('一对一','一对多') COLLATE utf8mb4_unicode_ci NULL COMMENT '教学类型',
ADD COLUMN `original_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '原始文本';

-- 修改南京数据库
ALTER TABLE nj_education_system.tutor_orders 
MODIFY COLUMN `teaching_type` enum('一对一','一对多') COLLATE utf8mb4_unicode_ci NULL COMMENT '教学类型',
ADD COLUMN `original_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '原始文本';

-- 修改西安数据库
ALTER TABLE xa_education_system.tutor_orders 
MODIFY COLUMN `teaching_type` enum('一对一','一对多') COLLATE utf8mb4_unicode_ci NULL COMMENT '教学类型',
ADD COLUMN `original_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '原始文本';

-- 修改上海数据库
ALTER TABLE sh_education_system.tutor_orders 
MODIFY COLUMN `teaching_type` enum('一对一','一对多') COLLATE utf8mb4_unicode_ci NULL COMMENT '教学类型',
ADD COLUMN `original_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '原始文本';
