"use client";

import { useState, type ReactNode } from "react";
import {
  Modal,
  Box,
  IconButton,
  type ModalProps,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

export interface BaseModalProps
  extends Omit<ModalProps, "children" | "open" | "onClose"> {
  /**
   * Whether the modal is open.
   */
  open: boolean;

  /**
   * Called when the user requests to close the modal
   * (backdrop click, ESC key, close button, etc.).
   */
  onClose: () => void;

  /**
   * Modal content.
   */
  children: ReactNode;

  /**
   * Max width of the inner content box.
   * Defaults to 600.
   */
  maxWidth?: number | string;

  /**
   * Min width of the inner content box.
   */
  minWidth?: number | string;

  /**
   * If true, the content box will use full height minus a small margin.
   */
  fullHeight?: boolean;

  /**
   * Show the close (X) button in the header.
   * Defaults to true.
   */
  showCloseButton?: boolean;

  /**
   * Show the fullscreen toggle button in the header.
   * Defaults to true on desktop, false on small screens.
   */
  showFullscreenToggle?: boolean;

  /**
   * Initial fullscreen state when the modal opens.
   * Defaults to false on desktop, true on small screens.
   */
  initialFullscreen?: boolean;
}

/**
 * BaseModal
 *
 * Theme-aware wrapper around MUI's Modal.
 *
 * - Centers content with a styled Box.
 * - Uses theme background, text color, border radius, and shadow.
 * - Optional header with close + fullscreen toggle buttons.
 * - Respects small screens (auto-fullscreen by default on mobile).
 */
export default function BaseModal({
  open,
  onClose,
  children,
  maxWidth = 600,
  minWidth,
  fullHeight = false,
  showCloseButton = true,
  showFullscreenToggle,
  initialFullscreen,
  sx,
  ...modalProps
}: BaseModalProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isFullscreen, setIsFullscreen] = useState<boolean>(
    initialFullscreen ?? isSmallScreen ?? false,
  );

  const effectiveShowFullscreen =
    typeof showFullscreenToggle === "boolean"
      ? showFullscreenToggle
      : !isSmallScreen;

  const handleClose = () => {
    onClose();
  };

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-modal="true"
      {...modalProps}
    >
      <Box
        sx={{
          position: "absolute",
          top: isFullscreen ? 0 : "50%",
          left: isFullscreen ? 0 : "50%",
          transform: isFullscreen ? "none" : "translate(-50%, -50%)",
          width: isFullscreen ? "100%" : "auto",
          height: isFullscreen
            ? "100%"
            : fullHeight
              ? "calc(100% - 64px)"
              : "auto",
          maxWidth: isFullscreen ? "100%" : maxWidth,
          minWidth: isFullscreen ? "100%" : minWidth,
          maxHeight: isFullscreen ? "100%" : "calc(100% - 64px)",
          display: "flex",
          flexDirection: "column",
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 0,            // ⬅️ no rounding at all
          boxShadow: theme.shadows[24],
          overflow: "hidden",
          outline: "none",
          ...sx,
        }}
      >
        {(showCloseButton || effectiveShowFullscreen) && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 0.5,
              px: 1,
              pt: 1,
              pb: 0.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            {effectiveShowFullscreen && (
              <IconButton
                size="small"
                onClick={handleToggleFullscreen}
                aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            )}

            {showCloseButton && (
              <IconButton
                size="small"
                onClick={handleClose}
                aria-label="Close"
                sx={{ color: theme.palette.error.main }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
}