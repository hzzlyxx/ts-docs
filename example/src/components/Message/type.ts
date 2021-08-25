/*
 * @Author: hzzly
 * @Date: 2021-08-06 15:40:23
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-25 10:38:19
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
import { CSSProperties, ReactNode } from "react";

/**
 * @name Message
 * @description 提示组件
 */
export interface MessageProps {
  className?: string;
  style?: CSSProperties;
  /**
   * @description 提示内容
   */
  content: ReactNode;
  /**
   * @description 提示类型，对应不同的样式
   */
  type: "check" | "fail" | "lock" | "info";
  /**
   * @description 自定义图标
   */
  icon?: ReactNode;
}
