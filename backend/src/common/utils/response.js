export function ok(res, data = {}, message = 'ok') {
  return res.json({
    success: true,
    message,
    data
  });
}
