import { weaponFormProfiles } from "../model/weaponForms";
import type { WeaponForm, WeaponFormProfile } from "../model/weapon.types";

export function getWeaponFormProfile(
    form: WeaponForm,
): WeaponFormProfile | undefined {
    return weaponFormProfiles.find((profile) => profile.form === form);
}