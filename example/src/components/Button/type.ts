/*
 * @Author: hzzly
 * @Date: 2021-07-28 16:29:17
 * @LastEditors: hzzly
 * @LastEditTime: 2021-08-06 16:40:56
 * @Copyright: hzzly(hjingren@aliyun.com)
 * @Description: description
 */
import { MouseEvent } from "react";
/**
 * @name Button
 * @description 按钮组件
 */
export interface ButtonProps {
  /**
   * @description Button 类型
   */
  htmlType?: "button" | "submit" | "reset";
  /**
   * @description Button 跳转地址
   */
  href?: string;
  /**
   * @description 是否显示 loading
   * @default false
   */
  loading?: boolean;
  /**
   * @description 是否禁用
   */
  disabled?: boolean;
  /**
   * @description Button 点击事件
   */
  onClick?: (event?: MouseEvent<HTMLElement>) => void;
}
