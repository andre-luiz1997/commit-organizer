import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emoji',
  standalone: true,
})
export class EmojiPipe implements PipeTransform {
  // A map of common gitmoji and other emoji shortcodes to their corresponding emojis.
  private emojiMap: { [key: string]: string } = {
    ':art:': '🎨',
    ':zap:': '⚡️',
    ':fire:': '🔥',
    ':bug:': '🐛',
    ':ambulance:': '🚑',
    ':sparkles:': '✨',
    ':memo:': '📝',
    ':rocket:': '🚀',
    ':lipstick:': '💄',
    ':tada:': '🎉',
    ':white_check_mark:': '✅',
    ':lock:': '🔒',
    ':closed_lock_with_key:': '🔐',
    ':bookmark:': '🔖',
    ':rotating_light:': '🚨',
    ':construction:': '🚧',
    ':green_heart:': '💚',
    ':arrow_down:': '⬇️',
    ':arrow_up:': '⬆️',
    ':pushpin:': '📌',
    ':construction_worker:': '👷',
    ':chart_with_upwards_trend:': '📈',
    ':recycle:': '♻️',
    ':heavy_plus_sign:': '➕',
    ':heavy_minus_sign:': '➖',
    ':wrench:': '🔧',
    ':hammer:': '🔨',
    ':globe_with_meridians:': '🌐',
    ':pencil2:': '✏️',
    ':pencil:': '✏️',
    ':poop:': '💩',
    ':rewind:': '⏪',
    ':twisted_rightwards_arrows:': '🔀',
    ':package:': '📦',
    ':alien:': '👽',
    ':truck:': '🚚',
    ':page_facing_up:': '📄',
    ':boom:': '💥',
    ':bento:': '🍱',
    ':wheelchair:': '♿️',
    ':bulb:': '💡',
    ':beers:': '🍻',
    ':speech_balloon:': '💬',
    ':card_file_box:': '🗃️',
    ':loud_sound:': '🔊',
    ':mute:': '🔇',
    ':busts_in_silhouette:': '👥',
    ':children_crossing:': '🚸',
    ':building_construction:': '🏗️',
    ':iphone:': '📱',
    ':clown_face:': '🤡',
    ':egg:': '🥚',
    ':see_no_evil:': '🙈',
    ':camera_flash:': '📸',
    ':alembic:': '⚗️',
    ':mag:': '🔍',
    ':label:': '🏷️',
    ':seedling:': '🌱',
    ':triangular_flag_on_post:': '🚩',
    ':goal_net:': '🥅',
    ':dizzy:': '😵',
    ':wastebasket:': '🗑️',
    ':passport_control:': '🛂',
    ':adhesive_bandage:': '🩹',
    ':monocle_face:': '🧐',
    ':coffin:': '⚰️',
    ':test_tube:': '🧪',
    ':necktie:': '👔',
    ':stethoscope:': '🩺',
    ':bricks:': '🧱',
    ':technologist:': '🧑‍💻',
    ':heavy_check_mark:': '✔️',
  };

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    // Regex to find all shortcodes like :word: or :word_with_underscore:
    const regex = /:\w+:/g;
    return value.replace(regex, (match) => this.emojiMap[match] || match);
  }
}
