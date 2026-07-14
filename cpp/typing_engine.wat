;; Portable WebAssembly representation of cpp/typing_engine.cpp.
;; `npm run build:wasm` creates the browser artifact from this file without
;; requiring a C++ compiler on Cloudflare Pages.
(module
  (func $round10 (param $value f64) (result f64)
    local.get $value
    f64.const 10
    f64.mul
    f64.nearest
    f64.const 10
    f64.div)

  (func (export "calculate_wpm") (param $characters f64) (param $seconds f64) (result f64)
    local.get $characters f64.const 0 f64.le
    local.get $seconds f64.const 0 f64.le
    i32.or
    if (result f64)
      f64.const 0
    else
      local.get $characters f64.const 12 f64.mul local.get $seconds f64.div call $round10
    end)

  (func (export "calculate_raw_wpm") (param $characters f64) (param $seconds f64) (result f64)
    local.get $characters f64.const 0 f64.le
    local.get $seconds f64.const 0 f64.le
    i32.or
    if (result f64)
      f64.const 0
    else
      local.get $characters f64.const 12 f64.mul local.get $seconds f64.div call $round10
    end)

  (func (export "calculate_accuracy") (param $correct f64) (param $total f64) (result f64)
    local.get $correct f64.const 0 f64.le
    local.get $total f64.const 0 f64.le
    i32.or
    if (result f64)
      f64.const 0
    else
      local.get $correct local.get $total f64.div f64.const 100 f64.mul
      f64.const 100 f64.min f64.const 0 f64.max call $round10
    end)

  (func (export "calculate_xp") (param $wpm f64) (param $accuracy f64) (param $duration f64) (param $difficulty f64) (result f64)
    local.get $wpm f64.const 0 f64.le
    local.get $accuracy f64.const 0 f64.le i32.or
    local.get $duration f64.const 0 f64.le i32.or
    if (result f64)
      f64.const 0
    else
      local.get $wpm local.get $accuracy f64.const 100 f64.div f64.mul
      local.get $duration f64.const 10 f64.div f64.add
      local.get $difficulty f64.mul f64.nearest f64.const 5 f64.max
    end)

  (func (export "calculate_level") (param $xp f64) (result f64)
    local.get $xp f64.const 0 f64.max f64.const 120 f64.div f64.sqrt f64.floor
    f64.const 1 f64.add f64.const 1 f64.max)

  (func (export "is_personal_best") (param $wpm f64) (param $best f64) (result f64)
    local.get $wpm local.get $best f64.gt f64.convert_i32_u)
)
