#include <cmath>

namespace {
double round_to_tenth(double value) {
  return std::round(value * 10.0) / 10.0;
}

double clamp(double value, double minimum, double maximum) {
  return std::fmin(std::fmax(value, minimum), maximum);
}
}  // namespace

extern "C" {

double calculate_wpm(double correct_characters, double elapsed_seconds) {
  if (correct_characters <= 0 || elapsed_seconds <= 0) return 0;
  return round_to_tenth(correct_characters / 5.0 / (elapsed_seconds / 60.0));
}

double calculate_raw_wpm(double total_characters, double elapsed_seconds) {
  if (total_characters <= 0 || elapsed_seconds <= 0) return 0;
  return round_to_tenth(total_characters / 5.0 / (elapsed_seconds / 60.0));
}

double calculate_accuracy(double correct_characters, double total_characters) {
  if (correct_characters <= 0 || total_characters <= 0) return 0;
  return round_to_tenth(clamp(correct_characters / total_characters * 100.0, 0, 100));
}

double calculate_xp(double wpm, double accuracy, double duration, double difficulty) {
  if (wpm <= 0 || accuracy <= 0 || duration <= 0) return 0;
  return std::fmax(5, std::round((wpm * (accuracy / 100.0) + duration / 10.0) * difficulty));
}

double calculate_level(double xp) {
  return std::fmax(1, std::floor(std::sqrt(std::fmax(0, xp) / 120.0)) + 1);
}

double is_personal_best(double wpm, double best_wpm) {
  return wpm > best_wpm ? 1 : 0;
}

}
