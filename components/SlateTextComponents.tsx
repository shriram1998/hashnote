import React, { Ref ,forwardRef} from 'react'
import { IconButton } from '@chakra-ui/react';

interface BaseProps {
  className: string,
  icon: React.ReactElement;
  [key: string]: unknown
}
type OrNull<T> = T | null

const ButtonComponent = (
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
export const Button = forwardRef(ButtonComponent);