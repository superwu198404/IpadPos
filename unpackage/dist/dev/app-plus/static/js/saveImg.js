function imageDown(base64, success, error) {

  var bitmap = new plus.nativeObj.Bitmap('image')

  bitmap.loadBase64Data(base64, function (i) {

    bigmapToSave(bitmap, success, error)

  }, function (err) {

    plus.nativeUI(err.message)

  })

}

function bigmapToSave(bitmap, success, error) {

  var name = randomString(10)

  bitmap.save(`_doc/${name}.jpg`, { overwrite: false }, function (event) {

    console.log(event.target)

    imageSaveByGallery(event.target, success, error)

  }, function (err) {

    plus.nativeUI(err.message)

  })

}

 function imageSaveByGallery(url, success, error) {

  plus.gallery.save(url, function (event) {

    const tarbitmap = plus.nativeObj.Bitmap.getBitmapById('image')

    tarbitmap.clear()

    success()

  }, function (err) {

    plus.nativeUI(err.message)

    error()

  })

}

 function randomString (e) {

  e = e || 32

  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'

  var a = t.length

  var n = ''

  for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a))

  return n

}


module.exports = {
	imageDown: imageDown,
}

