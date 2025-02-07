-- 天津数据库
ALTER TABLE tj_education_system.tutor_orders 
MODIFY COLUMN `student_gender` ENUM('男','女') NULL,
MODIFY COLUMN `tutoring_time` TEXT NULL,
MODIFY COLUMN `salary` VARCHAR(100) NULL;

-- 北京数据库
ALTER TABLE bj_education_system.tutor_orders 
MODIFY COLUMN `student_gender` ENUM('男','女') NULL,
MODIFY COLUMN `tutoring_time` TEXT NULL,
MODIFY COLUMN `salary` VARCHAR(100) NULL;

-- 武汉数据库
ALTER TABLE wh_education_system.tutor_orders 
MODIFY COLUMN `student_gender` ENUM('男','女') NULL,
MODIFY COLUMN `tutoring_time` TEXT NULL,
MODIFY COLUMN `salary` VARCHAR(100) NULL;

-- 南京数据库
ALTER TABLE nj_education_system.tutor_orders 
MODIFY COLUMN `student_gender` ENUM('男','女') NULL,
MODIFY COLUMN `tutoring_time` TEXT NULL,
MODIFY COLUMN `salary` VARCHAR(100) NULL;

-- 西安数据库
ALTER TABLE xa_education_system.tutor_orders 
MODIFY COLUMN `student_gender` ENUM('男','女') NULL,
MODIFY COLUMN `tutoring_time` TEXT NULL,
MODIFY COLUMN `salary` VARCHAR(100) NULL;

-- 上海数据库
ALTER TABLE sh_education_system.tutor_orders 
MODIFY COLUMN `student_gender` ENUM('男','女') NULL,
MODIFY COLUMN `tutoring_time` TEXT NULL,
MODIFY COLUMN `salary` VARCHAR(100) NULL;
