import React, { useState } from 'react';
import { StyleSheet, View, Modal, Text, Platform } from 'react-native';

import DropDownPicker from 'react-native-dropdown-picker';

import { ANDROID_VOICES, IOS_VOICES, RATES, PITCHES } from '../constants/ttsControls';
import { COLORS, SIZES, FONTS } from '../constants/theme';

export default function PlayOptionsModal({ options, setOptions, show, setShow }) {
  const [openVoices, setOpenVoices] = useState(false);
  const [openRates, setOpenRates] = useState(false);
  const [openPitches, setOpenPitches] = useState(false);

  const [voice, setVoice] = useState(options.voice);
  const [rate, setRate] = useState(options.rate);
  const [pitch, setPitch] = useState(options.pitch);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={() => setShow(false)}
    >
      <View style={styles.container}>
        <View style={styles.pageModal}>
          <Text style={styles.modalTitle}>Adjust Playback</Text>
          <Text style={styles.optionHeader}>Voice</Text>
          <DropDownPicker
            containerStyle={styles.dropdown}
            closeAfterSelecting={true}
            open={openVoices}
            setOpen={setOpenVoices}
            value={voice}
            setValue={setVoice}
            items={Platform.OS === 'ios' ? IOS_VOICES : ANDROID_VOICES}
            onChangeValue={value => setOptions(prev => ({
              ...prev,
              voice: value,
            }))}
            zIndex={3}
          />

          <Text style={styles.optionHeader}>Rate</Text>
          <DropDownPicker
            containerStyle={styles.dropdown}
            closeAfterSelecting={true}
            open={openRates}
            setOpen={setOpenRates}
            value={rate}
            setValue={setRate}
            items={RATES}
            onChangeValue={value => setOptions(prev => ({
              ...prev,
              rate: value,
            }))}
            zIndex={2}
          />

          <Text style={styles.optionHeader}>Pitch</Text>
          <DropDownPicker
            containerStyle={styles.dropdown}
            closeAfterSelecting={true}
            dropDownDirection="TOP"
            open={openPitches}
            setOpen={setOpenPitches}
            value={pitch}
            setValue={setPitch}
            items={PITCHES}
            onChangeValue={value => setOptions(prev => ({
              ...prev,
              pitch: value,
            }))}
            zIndex={1}
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageModal: {
    width: '75%',
    height: '75%',
    borderRadius: 16,
    borderColor: COLORS.saffron,
    borderWidth: 2,
    backgroundColor: COLORS.white,
    padding: 16,
    zIndex: 10,
  },
  modalTitle: {
    ...FONTS.h2,
    color: COLORS.offblack,
    textAlign: 'center',
    marginBottom: 16,
  },
  dropdown: {
    marginTop: 8,
    marginBottom: 16,
  },
  optionHeader: {
    ...FONTS.h3,
    textAlign: 'left',
    fontWeight: "bold",
    marginLeft: 8,
  }
})