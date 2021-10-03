import React, { Ref } from 'react'
import { IconButton } from '@chakra-ui/react';

interface BaseProps {
  className: string,
  icon: React.ReactElement;
  [key: string]: unknown
}
type OrNull<T> = T | null

export const Button = React.forwardRef(
  (
    {
      className,
      active,
      reversed,
      icon,
      ...props
    }: BaseProps,
    ref: Ref<OrNull<HTMLButtonElement>>
  ) => (
    <IconButton
      {...props}
      ref={ref}
      borderWidth="0px"
      aria-label="format-buttons"
      variant={active && !reversed ? "solid" : "outline"}
      colorScheme="gray"
      icon={icon} />
  )
)