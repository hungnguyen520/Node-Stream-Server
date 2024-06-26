#!/usr/bin/env node 

const NodeMediaServer = require('..');
let argv = require('minimist')(process.argv.slice(2),
  {
    string:['rtmp_port','http_port','https_port'],
    alias: {
      'rtmp_port': 'r',
      'http_port': 'h',
      'https_port': 's',
    },
    default:{
      'rtmp_port': 1935,
      'http_port': 8000,
      'https_port': 8443,
    }
  });
  
if (argv.help) {
  console.log('Usage:');
  console.log('  node-media-server --help // print help information');
  console.log('  node-media-server --rtmp_port 1935 or -r 1935');
  console.log('  node-media-server --http_port 8000 or -h 8000');
  console.log('  node-media-server --https_port 8443 or -s 8443');
  process.exit(0);
}

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  http: {
    port: 8000,
    mediaroot: './media',
    allow_origin: '*'
  },
  trans: {
    // ffmpeg: '/usr/local/bin/ffmpeg',
    ffmpeg: '/opt/homebrew/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        vc: "copy",
        vcParam: [],
        ac: "aac",
        acParam: [],
        rtmp:true,
        rtmpApp:'live1',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        // dash: true,
        // dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      },
      {
        app: 'live_720',
        vc: "copy",
        vcParam: [
          '-vf', 'scale=-1:720',
          '-c:v', 'libx264',
          '-crf', '0',
        ],
        ac: "aac",
        acParam: [
          '-ab', '128k'
        ],
        rtmp:true,
        rtmpApp:'live2',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
      },
      {
        app: 'live_480',
        vc: "copy",
        vcParam: [
          '-vf', 'scale=-1:480',
          '-c:v', 'libx264',
          '-crf', '0',
          '-preset', 'veryslow'
        ],
        ac: "aac",
        acParam: [
          '-ab', '96k', 
        ],
        rtmp:true,
        rtmpApp:'live3',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
      },
      {
        app: 'live_360',
        vc: "copy",
        vcParam: [
          '-vf', 'scale=-1:360',
          '-c:v', 'libx264',
          '-crf', '0',
          '-preset', 'veryslow'
        ],
        ac: "aac",
        acParam: [
          '-ab', '96k', 
        ],
        rtmp:true,
        rtmpApp:'live4',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
      }
    ]
  },
  // fission: {
  //   ffmpeg: '/usr/local/bin/ffmpeg',
  //   tasks: [
  //     {
  //       rule: "live1/*", // rtmpApp/stream_name
  //       model: [
          // {
          //   ab: "192k",
          //   vb: "2500k",
          //   vs: "1920x1080",
          //   vf: "60",
          // },
          // {
          //   ab: "128k",
          //   vb: "1500k",
          //   vs: "1280x720",
          //   vf: "30",
          // },
          // {
          //   ab: "96k",
          //   vb: "1000k",
          //   vs: "854x480",
          //   vf: "24",
          // },
          // {
          //   ab: "96k",
          //   vb: "600k",
          //   vs: "640x360",
          //   vf: "20",
          // },
    //     ]
    //   },

    // ]
  // }
};


let nms = new NodeMediaServer(config);
nms.run();

nms.on('preConnect', (id, args) => {
  console.log('[NodeEvent on preConnect]', `id=${id} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postConnect', (id, args) => {
  console.log('[NodeEvent on postConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('doneConnect', (id, args) => {
  console.log('[NodeEvent on doneConnect]', `id=${id} args=${JSON.stringify(args)}`);
});

nms.on('prePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePublish]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('prePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on prePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
  // let session = nms.getSession(id);
  // session.reject();
});

nms.on('postPlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on postPlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

nms.on('donePlay', (id, StreamPath, args) => {
  console.log('[NodeEvent on donePlay]', `id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`);
});

