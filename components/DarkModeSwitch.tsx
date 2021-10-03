import { useColorMode,useColorModeValue, IconButton } from '@chakra-ui/react'
import { FaMoon, FaSun } from "react-icons/fa";
export default function DarkModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode()
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  return (
    <IconButton
      size="md"
      fontSize="lg"
      aria-label={`Switch to ${colorMode} mode`}
      variant="ghost"
      color="current"
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
    />
  )
}