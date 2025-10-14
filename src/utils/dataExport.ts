import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

type Dump = Record<string, unknown>;

const BACKUP_KEYS = [
  "lifts_weights",
  "lifts_workout_history",
  "lifts_exercise_failures",
  "lifts_exercise_deloads",
  "lifts_unit_system",
  "lifts_accessories",
  "lifts_accessory_colors",
  "lifts_rep_schemes",
  "lifts_available_plates"
];

const nowStamp = () => {
  const d = new Date();
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(
    d.getHours()
  )}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
};

export async function exportData(): Promise<boolean> {
  try {
    const dump: Dump = {
      version: "1.0.0",
      exportDate: new Date().toISOString()
    };

    const entries = await AsyncStorage.multiGet(BACKUP_KEYS);
    for (const [k, v] of entries) {
      dump[k] = v ? JSON.parse(v) : null;
    }

    const dir = new Directory(Paths.document, "simple5x5-backups");

    if (!dir.exists) {
      await dir.create();
    }

    const filename = `simple5x5-${nowStamp()}.json`;
    const file = new File(dir, filename);
    await file.create();
    await file.write(JSON.stringify(dump, null, 2));

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: "Save your workout backup",
        UTI: "public.json"
      });
    }

    return true;
  } catch (error) {
    console.error("Export failed:", error);
    Alert.alert(
      "Export Failed",
      "An error occurred while exporting your data."
    );
    return false;
  }
}

export async function importData(
  onSuccess?: () => Promise<void>
): Promise<boolean> {
  try {
    const picked = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true
    });

    if (picked.canceled || !picked.assets?.length) return false;

    const file = new File(picked.assets[0].uri);
    const text = await file.text();
    const parsed = JSON.parse(text) as Dump;

    if (!parsed.version) {
      Alert.alert(
        "Invalid File",
        "The selected file is not a valid Simple 5×5 backup."
      );
      return false;
    }

    const toWrite: [string, string][] = [];
    for (const key of BACKUP_KEYS) {
      if (key in parsed && parsed[key] !== null) {
        toWrite.push([key, JSON.stringify(parsed[key])]);
      }
    }

    if (toWrite.length) {
      await AsyncStorage.multiSet(toWrite);

      if (onSuccess) {
        await onSuccess();
      }

      Alert.alert(
        "Import Complete",
        "Your data has been imported successfully!"
      );
    }

    return true;
  } catch (error) {
    console.error("Import failed:", error);
    Alert.alert(
      "Import Failed",
      "An error occurred while importing your data."
    );
    return false;
  }
}
