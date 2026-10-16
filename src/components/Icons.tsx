import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '../theme/colors';

interface IconProps {
  size?: number;
  color?: string;
}


export const LockIcon: React.FC<IconProps> = ({ size = 18, color = colors.textMuted }) => {
  const shackleSize = {
    width: size * 0.6,
    height: size * 0.45,
    borderColor: color,
    borderTopLeftRadius: (size * 0.6) / 2,
    borderTopRightRadius: (size * 0.6) / 2,
  };
  const bodySize = {
    width: size * 0.85,
    height: size * 0.6,
    backgroundColor: color,
  };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.shackle, shackleSize]} />
      <View style={[styles.lockBody, bodySize]}>
        <View style={styles.keyhole} />
      </View>
    </View>
  );
};

// ID Card / Badge Icon
export const IdCardIcon: React.FC<IconProps> = ({ size = 20, color = colors.textMuted }) => {
  const cardSize = {
    width: size,
    height: size * 0.75,
    borderColor: color,
  };
  const photoSize = {
    width: size * 0.28,
    height: size * 0.38,
    backgroundColor: color,
  };
  const lineBg = { backgroundColor: color };

  return (
    <View style={[styles.cardContainer, cardSize]}>
      <View style={[styles.photo, photoSize]} />
      <View style={styles.cardLines}>
        <View style={[styles.lineLong, lineBg]} />
        <View style={[styles.lineShort, lineBg]} />
      </View>
    </View>
  );
};

// Eye Icon (Show / Hide Password)
export const EyeIcon: React.FC<IconProps & { visible?: boolean }> = ({
  size = 20,
  color = colors.textMuted,
  visible = false,
}) => {
  const eyeBorder = {
    width: size * 0.9,
    height: size * 0.55,
    borderColor: color,
    borderRadius: size * 0.35,
  };
  const pupilSize = {
    width: size * 0.26,
    height: size * 0.26,
    borderRadius: (size * 0.26) / 2,
    backgroundColor: color,
  };
  const slashStyle = {
    width: size * 1.05,
    backgroundColor: color,
  };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.eyeOutline, eyeBorder]}>
        <View style={pupilSize} />
      </View>
      {!visible && <View style={[styles.slash, slashStyle]} />}
    </View>
  );
};

// Mobile / Phone Icon
export const PhoneIcon: React.FC<IconProps> = ({ size = 20, color = colors.secondaryRoyal }) => {
  const phoneSize = {
    width: size * 0.65,
    height: size,
    borderColor: color,
  };
  const speakerBg = { backgroundColor: color };
  const homeBg = { backgroundColor: color };

  return (
    <View style={[styles.phoneContainer, phoneSize]}>
      <View style={[styles.speaker, speakerBg]} />
      <View style={[styles.homeButton, homeBg]} />
    </View>
  );
};

// Support Headset Icon
export const SupportIcon: React.FC<IconProps> = ({ size = 18, color = colors.secondaryRoyal }) => {
  const arcSize = {
    width: size * 0.85,
    height: size * 0.5,
    borderColor: color,
    borderTopLeftRadius: (size * 0.85) / 2,
    borderTopRightRadius: (size * 0.85) / 2,
  };
  const earRowSize = { width: size * 0.95 };
  const earBg = { backgroundColor: color };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.headband, arcSize]} />
      <View style={[styles.earRow, earRowSize]}>
        <View style={[styles.earpad, earBg]} />
        <View style={[styles.earpad, earBg]} />
      </View>
    </View>
  );
};

// Location Pin Icon
export const LocationPinIcon: React.FC<IconProps> = ({ size = 18, color = colors.textMuted }) => {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: (size * 0.7) / 2,
          borderWidth: 1.8,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.22,
            height: size * 0.22,
            borderRadius: (size * 0.22) / 2,
            backgroundColor: color,
          }}
        />
      </View>
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.2,
          borderRightWidth: size * 0.2,
          borderTopWidth: size * 0.32,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          marginTop: -2,
        }}
      />
    </View>
  );
};

// WhatsApp / Contact Icon
export const WhatsAppIcon: React.FC<IconProps> = ({ size = 18, color = '#25D366' }) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <PhoneIcon size={size * 0.55} color={colors.white} />
    </View>
  );
};

// Edit / Pencil Icon
export const EditPencilIcon: React.FC<IconProps> = ({ size = 16, color = colors.white }) => {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.3,
          height: size * 0.72,
          borderWidth: 1.6,
          borderColor: color,
          borderRadius: 2,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

// Info "i" Icon
export const InfoBoldIcon: React.FC<IconProps> = ({ size = 16, color = '#F59E0B' }) => {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: (size * 0.28) / 2,
          backgroundColor: color,
          marginBottom: 2,
        }}
      />
      <View
        style={{
          width: size * 0.28,
          height: size * 0.45,
          borderRadius: 1.5,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

// Verified Shield / Star Badge Icon
export const VerifiedBadgeIcon: React.FC<IconProps> = ({
  size = 14,
  color = colors.secondaryRoyal,
}) => {
  const badgeSize = {
    width: size * 0.8,
    height: size * 0.8,
    borderColor: color,
  };
  const dotBg = { backgroundColor: color };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.badgeDiamond, badgeSize]}>
        <View style={[styles.badgeDot, dotBg]} />
      </View>
    </View>
  );
};

// Checkmark Icon
export const CheckIcon: React.FC<IconProps> = ({ size = 12, color = colors.onPrimary }) => {
  const checkSize = {
    width: size * 0.7,
    height: size * 0.45,
    borderColor: color,
  };

  return <View style={[styles.checkmark, checkSize]} />;
};

// Arrow Back Icon
export const ArrowBackIcon: React.FC<IconProps> = ({ size = 20, color = colors.primaryNavy }) => {
  const headStyle = {
    width: size * 0.45,
    height: size * 0.45,
    borderColor: color,
  };
  const stemStyle = {
    width: size * 0.55,
    backgroundColor: color,
  };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.arrowHeadLeft, headStyle]} />
      <View style={[styles.arrowStemH, stemStyle]} />
    </View>
  );
};

// Arrow Right / Forward Icon
export const ArrowRightIcon: React.FC<IconProps> = ({ size = 18, color = colors.onPrimary }) => {
  const headStyle = {
    width: size * 0.45,
    height: size * 0.45,
    borderColor: color,
  };
  const stemStyle = {
    width: size * 0.55,
    backgroundColor: color,
  };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.arrowStemH, stemStyle]} />
      <View style={[styles.arrowHeadRight, headStyle]} />
    </View>
  );
};

// Help Outline Icon (?)
export const HelpIcon: React.FC<IconProps> = ({ size = 20, color = colors.secondaryRoyal }) => {
  const ringStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderColor: color,
  };
  const qTopStyle = { borderColor: color };
  const qDotStyle = { backgroundColor: color };

  return (
    <View style={[styles.center, styles.ring, ringStyle]}>
      <View style={[styles.qTop, qTopStyle]} />
      <View style={[styles.qDot, qDotStyle]} />
    </View>
  );
};

// Person Silhouette Icon
export const PersonIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 16,
  color = colors.textMuted,
  filled = true,
}) => {
  const headSize = size * 0.44;
  const headStyle = {
    width: headSize,
    height: headSize,
    borderRadius: headSize / 2,
    backgroundColor: filled ? color : 'transparent',
    borderWidth: filled ? 0 : 1.8,
    borderColor: color,
  };
  const bodyWidth = size * 0.82;
  const bodyHeight = size * 0.42;
  const bodyStyle = {
    width: bodyWidth,
    height: bodyHeight,
    borderTopLeftRadius: bodyWidth / 2,
    borderTopRightRadius: bodyWidth / 2,
    backgroundColor: filled ? color : 'transparent',
    borderWidth: filled ? 0 : 1.8,
    borderColor: color,
  };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={headStyle} />
      <View style={[styles.personBody, bodyStyle]} />
    </View>
  );
};

// Mail / Envelope Icon
export const MailIcon: React.FC<IconProps> = ({ size = 16, color = colors.textMuted }) => {
  const envStyle = {
    width: size,
    height: size * 0.72,
    borderColor: color,
  };
  const flapStyle = { borderColor: color };

  return (
    <View style={[styles.envelope, envStyle]}>
      <View style={[styles.envelopeFlap, flapStyle]} />
    </View>
  );
};

// Chevron Down Icon (Dropdown arrow)
export const ChevronDownIcon: React.FC<IconProps> = ({ size = 12, color = colors.textMuted }) => {
  const chevronStyle = {
    width: size * 0.65,
    height: size * 0.65,
    borderColor: color,
  };

  return <View style={[styles.chevronDown, chevronStyle]} />;
};

// Badge Icon (Center Hero Icon)
export const BadgeIcon: React.FC<IconProps> = ({ size = 26, color = colors.primaryNavy }) => {
  const cardStyle = {
    width: size * 0.75,
    height: size,
    borderColor: color,
  };
  const lineBg = { backgroundColor: color };

  return (
    <View style={[styles.badgeCard, cardStyle]}>
      <View style={[styles.badgeSlot, lineBg]} />
      <View style={[styles.badgePhoto, lineBg]} />
      <View style={[styles.badgeStripe, lineBg]} />
    </View>
  );
};
// Group / People Icon
export const GroupIcon: React.FC<IconProps> = ({ size = 22, color = colors.secondaryRoyal }) => {
  const headStyle = {
    width: size * 0.35,
    height: size * 0.35,
    borderRadius: (size * 0.35) / 2,
    borderColor: color,
  };
  const bodyStyle = {
    width: size * 0.55,
    height: size * 0.32,
    borderTopLeftRadius: (size * 0.55) / 2,
    borderTopRightRadius: (size * 0.55) / 2,
    borderColor: color,
  };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={styles.groupHeadRow}>
        <View style={[styles.groupHead, headStyle]} />
        <View style={[styles.groupHeadSecond, headStyle]} />
      </View>
      <View style={styles.groupBodyRow}>
        <View style={[styles.groupBody, bodyStyle]} />
        <View style={[styles.groupBodySecond, bodyStyle]} />
      </View>
    </View>
  );
};

export const ShieldCheckIcon: React.FC<IconProps> = ({
  size = 28,
  color = colors.secondaryBright,
}) => {
  const shieldOuter = {
    width: size * 0.78,
    height: size * 0.88,
    borderWidth: 2,
    borderColor: color,
    borderTopLeftRadius: size * 0.38,
    borderTopRightRadius: size * 0.38,
    borderBottomLeftRadius: size * 0.45,
    borderBottomRightRadius: size * 0.45,
  };

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View style={[styles.center, shieldOuter]}>
        <CheckIcon size={size * 0.45} color={color} />
      </View>
    </View>
  );
};

export const CalendarIcon: React.FC<IconProps> = ({
  size = 18,
  color = colors.textMuted,
}) => {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size * 0.95,
          borderRadius: 4,
          borderWidth: 1.5,
          borderColor: color,
          overflow: 'hidden',
          justifyContent: 'space-between',
        },
      ]}
    >
      <View
        style={{
          width: '100%',
          height: size * 0.3,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          padding: 2,
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
        <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
        <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
        <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: color }} />
      </View>
    </View>
  );
};

// Camera Icon
export const CameraIcon: React.FC<IconProps> = ({ size = 20, color = colors.primaryNavy }) => {
  const bodyWidth = size * 0.9;
  const bodyHeight = size * 0.65;
  const lensSize = size * 0.38;
  const bumpWidth = size * 0.32;
  const bumpHeight = size * 0.18;

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: bumpWidth,
          height: bumpHeight,
          backgroundColor: color,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderRadius: 4,
          backgroundColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: lensSize,
            height: lensSize,
            borderRadius: lensSize / 2,
            borderWidth: 1.5,
            borderColor: colors.white,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: lensSize * 0.35,
              height: lensSize * 0.35,
              borderRadius: (lensSize * 0.35) / 2,
              backgroundColor: colors.white,
            }}
          />
        </View>
      </View>
    </View>
  );
};

// Gallery / Photo Library Icon
export const GalleryIcon: React.FC<IconProps> = ({ size = 20, color = colors.primaryNavy }) => {
  const frameWidth = size * 0.9;
  const frameHeight = size * 0.75;

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: frameWidth,
          height: frameHeight,
          borderRadius: 4,
          borderWidth: 1.8,
          borderColor: color,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: frameHeight * 0.15,
            right: frameWidth * 0.18,
            width: size * 0.18,
            height: size * 0.18,
            borderRadius: (size * 0.18) / 2,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -frameHeight * 0.1,
            left: frameWidth * 0.05,
            width: frameWidth * 0.55,
            height: frameHeight * 0.55,
            borderTopLeftRadius: 3,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -frameHeight * 0.12,
            right: frameWidth * 0.05,
            width: frameWidth * 0.45,
            height: frameHeight * 0.45,
            borderTopLeftRadius: 3,
            backgroundColor: color,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
    </View>
  );
};

// Trash / Delete Icon
export const TrashIcon: React.FC<IconProps> = ({ size = 18, color = colors.error }) => {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.3,
          height: 2,
          backgroundColor: color,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
        }}
      />
      <View
        style={{
          width: size * 0.7,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          marginTop: 1,
        }}
      />
      <View
        style={{
          width: size * 0.52,
          height: size * 0.55,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
          borderWidth: 1.5,
          borderTopWidth: 0,
          borderColor: color,
          marginTop: 1,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          flexDirection: 'row',
          paddingHorizontal: 2,
        }}
      >
        <View style={{ width: 1.2, height: '70%', backgroundColor: color }} />
        <View style={{ width: 1.2, height: '70%', backgroundColor: color }} />
      </View>
    </View>
  );
};

// Close / Cross Icon
export const CloseIcon: React.FC<IconProps> = ({ size = 16, color = colors.textMuted }) => {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          position: 'absolute',
          width: size * 0.8,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.8,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
};

// Home Icon
export const HomeIcon: React.FC<IconProps & { filled?: boolean }> = ({
  size = 24,
  color = colors.primaryNavy,
  filled = false,
}) => {
  const roofWidth = size * 0.9;
  const roofHeight = size * 0.42;
  const bodyWidth = size * 0.72;
  const bodyHeight = size * 0.48;
  const doorWidth = size * 0.22;
  const doorHeight = size * 0.26;

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      {/* Roof peak */}
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: roofWidth / 2,
          borderRightWidth: roofWidth / 2,
          borderBottomWidth: roofHeight,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        }}
      />
      {/* House Body */}
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          backgroundColor: filled ? color : 'transparent',
          borderWidth: filled ? 0 : 2,
          borderTopWidth: 0,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: -1,
        }}
      >
        {/* Door */}
        <View
          style={{
            width: doorWidth,
            height: doorHeight,
            backgroundColor: filled ? colors.surfaceContainerLowest : color,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
      </View>
    </View>
  );
};

// Briefcase / Job Opportunities Icon
export const BriefcaseIcon: React.FC<IconProps> = ({ size = 20, color = colors.primaryNavy }) => {
  const handleWidth = size * 0.35;
  const handleHeight = size * 0.16;
  const bodyWidth = size * 0.9;
  const bodyHeight = size * 0.62;

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: handleWidth,
          height: handleHeight,
          borderWidth: 1.6,
          borderBottomWidth: 0,
          borderColor: color,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderRadius: 3.5,
          borderWidth: 1.8,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: '100%',
            height: 1.5,
            backgroundColor: color,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 4.5,
            height: 5,
            borderRadius: 1,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
};

// Document / Minutes Icon
export const DocumentIcon: React.FC<IconProps> = ({ size = 20, color = colors.primaryNavy }) => {
  const docWidth = size * 0.75;
  const docHeight = size * 0.9;

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: docWidth,
          height: docHeight,
          borderRadius: 3,
          borderWidth: 1.8,
          borderColor: color,
          paddingHorizontal: 3,
          paddingVertical: 3,
          justifyContent: 'space-around',
        }}
      >
        <View style={{ width: '85%', height: 1.6, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: '65%', height: 1.6, backgroundColor: color, borderRadius: 1 }} />
        <View style={{ width: '75%', height: 1.6, backgroundColor: color, borderRadius: 1 }} />
      </View>
    </View>
  );
};

// Logout / Exit Icon
export const LogoutIcon: React.FC<IconProps> = ({ size = 18, color = colors.error }) => {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          position: 'absolute',
          left: 1,
          width: size * 0.52,
          height: size * 0.82,
          borderWidth: 1.8,
          borderRightWidth: 0,
          borderColor: color,
          borderTopLeftRadius: 3,
          borderBottomLeftRadius: 3,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 2,
          width: size * 0.52,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          right: 2,
          width: size * 0.3,
          height: size * 0.3,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = colors.textMuted }) => {
  const circleSize = Math.round(size * 0.62);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          borderWidth: 1.8,
          borderColor: color,
          position: 'absolute',
          top: 1,
          left: 1,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: Math.round(size * 0.38),
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          bottom: 2,
          right: 1,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
};

export const ShareIcon: React.FC<IconProps> = ({ size = 18, color = colors.textMuted }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 2,
          top: size / 2 - 2.5,
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 2,
          right: 2,
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: color,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.55,
          height: 1.5,
          backgroundColor: color,
          transform: [{ rotate: '-28deg' }],
          top: size * 0.32,
          left: size * 0.22,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.55,
          height: 1.5,
          backgroundColor: color,
          transform: [{ rotate: '28deg' }],
          bottom: size * 0.32,
          left: size * 0.22,
        }}
      />
    </View>
  );
};

export const HospitalIcon: React.FC<IconProps> = ({ size = 20, color = colors.primaryNavy }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.85,
          height: size * 0.88,
          borderWidth: 1.8,
          borderColor: color,
          borderRadius: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{ width: 3, height: 8, backgroundColor: color, position: 'absolute' }} />
        <View style={{ width: 8, height: 3, backgroundColor: color, position: 'absolute' }} />
      </View>
    </View>
  );
};

export const YouTubeIcon: React.FC<IconProps> = ({ size = 20, color = '#FF0000' }) => {
  return (
    <View
      style={{
        width: size,
        height: size * 0.72,
        backgroundColor: color,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderLeftWidth: 6,
          borderTopWidth: 3.5,
          borderBottomWidth: 3.5,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderLeftColor: '#FFFFFF',
          marginLeft: 2,
        }}
      />
    </View>
  );
};

export const DashboardIcon: React.FC<IconProps> = ({ size = 22, color = '#7B8FA8' }) => {
  const boxSize = Math.round(size * 0.40);
  const gap = Math.round(size * 0.14);
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', gap: gap, marginBottom: gap }}>
        <View
          style={{
            width: boxSize,
            height: boxSize,
            borderRadius: 2.5,
            borderWidth: 1.8,
            borderColor: color,
          }}
        />
        <View
          style={{
            width: boxSize,
            height: boxSize,
            borderRadius: 2.5,
            borderWidth: 1.8,
            borderColor: color,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', gap: gap }}>
        <View
          style={{
            width: boxSize,
            height: boxSize,
            borderRadius: 2.5,
            borderWidth: 1.8,
            borderColor: color,
          }}
        />
        <View
          style={{
            width: boxSize,
            height: boxSize,
            borderRadius: 2.5,
            borderWidth: 1.8,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
};

export const JobsTabIcon: React.FC<IconProps> = ({ size = 24, color = '#7B8FA8' }) => {
  const bodyWidth = Math.round(size * 0.88);
  const bodyHeight = Math.round(size * 0.62);
  const handleWidth = Math.round(size * 0.36);
  const handleHeight = Math.round(size * 0.2);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: handleWidth,
          height: handleHeight,
          borderWidth: 1.8,
          borderBottomWidth: 0,
          borderColor: color,
          borderTopLeftRadius: 2.5,
          borderTopRightRadius: 2.5,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          width: bodyWidth,
          height: bodyHeight,
          borderWidth: 1.8,
          borderColor: color,
          borderRadius: 3.5,
        }}
      />
    </View>
  );
};

export const CertificatesTabIcon: React.FC<IconProps> = ({ size = 24, color = '#7B8FA8' }) => {
  const circleSize = Math.round(size * 0.68);
  return (
    <View style={{ width: size, height: size, alignItems: 'center' }}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          borderWidth: 1.8,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <Text style={{ fontSize: 9.5, color: color, lineHeight: 11, textAlign: 'center' }}>
          ★
        </Text>
      </View>
      <View
        style={{
          width: circleSize * 0.8,
          height: 6,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: -2,
          zIndex: 1,
        }}
      >
        <View
          style={{
            width: 3.5,
            height: 7,
            borderLeftWidth: 1.8,
            borderBottomWidth: 1.8,
            borderColor: color,
            transform: [{ rotate: '20deg' }],
          }}
        />
        <View
          style={{
            width: 3.5,
            height: 7,
            borderRightWidth: 1.8,
            borderBottomWidth: 1.8,
            borderColor: color,
            transform: [{ rotate: '-20deg' }],
          }}
        />
      </View>
    </View>
  );
};

export const MidTermTabIcon: React.FC<IconProps> = ({ size = 24, color = '#7B8FA8' }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.8,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 11.5, color: color, lineHeight: 14, textAlign: 'center' }}>
        ★
      </Text>
    </View>
  );
};

export const ProfileTabIcon: React.FC<IconProps> = ({ size = 24, color = '#7B8FA8' }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.8,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
          marginBottom: 1.5,
        }}
      />
      <View
        style={{
          width: 13,
          height: 6,
          borderTopLeftRadius: 6.5,
          borderTopRightRadius: 6.5,
          backgroundColor: color,
        }}
      />
    </View>
  );
};

export const BellIcon: React.FC<IconProps & { hasBadge?: boolean }> = ({ size = 20, color = colors.white, hasBadge = true }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.65,
          height: size * 0.65,
          borderTopLeftRadius: size * 0.35,
          borderTopRightRadius: size * 0.35,
          borderWidth: 1.8,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <View style={{ width: size * 0.85, height: 1.8, backgroundColor: color, marginBottom: -1 }} />
      </View>
      <View
        style={{
          width: 3,
          height: 2.5,
          backgroundColor: color,
          borderBottomLeftRadius: 1.5,
          borderBottomRightRadius: 1.5,
        }}
      />
      {hasBadge && (
        <View
          style={{
            position: 'absolute',
            top: 1,
            right: 1,
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#FF5722',
            borderWidth: 1,
            borderColor: '#0B1728',
          }}
        />
      )}
    </View>
  );
};

export const MegaphoneIcon: React.FC<IconProps> = ({ size = 18, color = '#FF5722' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderRightWidth: size * 0.55,
          borderTopWidth: size * 0.28,
          borderBottomWidth: size * 0.28,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          borderRightColor: color,
          marginLeft: -3,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 1,
          width: size * 0.28,
          height: size * 0.38,
          backgroundColor: color,
          borderRadius: 1.5,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: 3,
          bottom: 1,
          width: 2.5,
          height: 4,
          backgroundColor: color,
          transform: [{ rotate: '25deg' }],
        }}
      />
    </View>
  );
};

export const QrCodeIcon: React.FC<IconProps> = ({ size = 18, color = '#10B981' }) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderWidth: 1.5,
        borderColor: color,
        borderRadius: 3,
        padding: 2,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: 4, height: 4, backgroundColor: color }} />
        <View style={{ width: 4, height: 4, backgroundColor: color }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ width: 4, height: 4, backgroundColor: color }} />
        <View style={{ width: 4, height: 4, backgroundColor: color }} />
      </View>
    </View>
  );
};

export const BookOpenIcon: React.FC<IconProps> = ({ size = 18, color = '#2563EB' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
      <View
        style={{
          width: size * 0.42,
          height: size * 0.65,
          borderWidth: 1.8,
          borderColor: color,
          borderTopLeftRadius: 2,
          borderBottomLeftRadius: 2,
          borderRightWidth: 1,
        }}
      />
      <View
        style={{
          width: size * 0.42,
          height: size * 0.65,
          borderWidth: 1.8,
          borderColor: color,
          borderTopRightRadius: 2,
          borderBottomRightRadius: 2,
          borderLeftWidth: 1,
        }}
      />
    </View>
  );
};

export const AwardMedalIcon: React.FC<IconProps> = ({ size = 18, color = '#059669' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.65,
          height: size * 0.65,
          borderRadius: size * 0.35,
          borderWidth: 1.8,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 8, color: color, lineHeight: 9 }}>★</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 2, marginTop: -2 }}>
        <View style={{ width: 2.5, height: 4, backgroundColor: color, transform: [{ rotate: '15deg' }] }} />
        <View style={{ width: 2.5, height: 4, backgroundColor: color, transform: [{ rotate: '-15deg' }] }} />
      </View>
    </View>
  );
};

export const BookmarkIcon: React.FC<IconProps & { filled?: boolean }> = ({ size = 18, color = '#94A3B8', filled = false }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.65,
          height: size * 0.85,
          borderWidth: filled ? 0 : 1.8,
          borderColor: color,
          backgroundColor: filled ? color : 'transparent',
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
        }}
      />
    </View>
  );
};

export const SendPaperPlaneIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.75,
          height: size * 0.75,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginRight: 2,
        }}
      />
    </View>
  );
};

export const PlusIcon: React.FC<IconProps> = ({ size = 16, color = '#FFFFFF' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: size * 0.75,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          position: 'absolute',
        }}
      />
      <View
        style={{
          width: 2,
          height: size * 0.75,
          backgroundColor: color,
          borderRadius: 1,
          position: 'absolute',
        }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shackle: {
    borderWidth: 2,
    borderBottomWidth: 0,
    marginBottom: -1,
  },
  lockBody: {
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyhole: {
    width: 3,
    height: 4,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: 1.5,
  },
  cardContainer: {
    borderWidth: 1.8,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    justifyContent: 'space-between',
  },
  photo: {
    borderRadius: 1.5,
  },
  cardLines: {
    flex: 1,
    marginLeft: 3,
  },
  lineLong: {
    width: '90%',
    height: 1.8,
    borderRadius: 1,
    marginBottom: 2.5,
  },
  lineShort: {
    width: '65%',
    height: 1.8,
    borderRadius: 1,
  },
  eyeOutline: {
    borderWidth: 1.8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  slash: {
    position: 'absolute',
    height: 2,
    transform: [{ rotate: '-45deg' }],
  },
  phoneContainer: {
    borderWidth: 1.8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  speaker: {
    width: 5,
    height: 1.5,
    borderRadius: 1,
  },
  homeButton: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  headband: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    marginBottom: 1,
  },
  earRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -4,
  },
  earpad: {
    width: 3.5,
    height: 6,
    borderRadius: 1.5,
  },
  badgeDiamond: {
    borderRadius: 2,
    borderWidth: 1.6,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
  },
  checkmark: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: '-45deg' }],
    marginBottom: 2,
  },
  arrowHeadLeft: {
    position: 'absolute',
    left: 2,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    transform: [{ rotate: '-45deg' }],
  },
  arrowHeadRight: {
    position: 'absolute',
    right: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: '45deg' }],
  },
  arrowStemH: {
    height: 2,
    borderRadius: 1,
  },
  ring: {
    borderWidth: 1.8,
  },
  qTop: {
    width: 6,
    height: 5,
    borderTopWidth: 1.8,
    borderRightWidth: 1.8,
    borderLeftWidth: 1.8,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: 1,
  },
  qDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
  },
  personBody: {
    marginTop: 1,
  },
  envelope: {
    borderWidth: 1.8,
    borderRadius: 3,
    alignItems: 'center',
    overflow: 'hidden',
  },
  envelopeFlap: {
    width: '100%',
    height: 6,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    transform: [{ scaleX: 1.2 }],
  },
  chevronDown: {
    borderRightWidth: 1.8,
    borderBottomWidth: 1.8,
    transform: [{ rotate: '45deg' }],
    marginBottom: 2,
  },
  badgeCard: {
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    paddingVertical: 2,
    justifyContent: 'space-between',
  },
  badgeSlot: {
    width: 6,
    height: 2,
    borderRadius: 1,
  },
  badgePhoto: {
    width: 10,
    height: 8,
    borderRadius: 2,
  },
  badgeStripe: {
    width: 12,
    height: 2,
    borderRadius: 1,
  },
  groupHeadRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  groupHead: {
    borderWidth: 1.8,
  },
  groupHeadSecond: {
    borderWidth: 1.8,
    marginLeft: -4,
  },
  groupBodyRow: {
    flexDirection: 'row',
  },
  groupBody: {
    borderWidth: 1.8,
    borderBottomWidth: 0,
  },
  groupBodySecond: {
    borderWidth: 1.8,
    borderBottomWidth: 0,
    marginLeft: -4,
  },
});
