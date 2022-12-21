#import "React/RCTViewManager.h"
#import "React/RCTEventEmitter.h"

@interface RCT_EXTERN_MODULE(BLVideoView, RCTViewManager)

    RCT_EXTERN_METHOD(attachAsLocal:(nonnull NSNumber *)node)

    RCT_EXTERN_METHOD(attachAsRemote:(nonnull NSNumber *)node)

    RCT_EXTERN_METHOD(detach:(nonnull NSNumber *)node)

@end

@interface RCT_EXTERN_MODULE(BoostlingoSdk, RCTEventEmitter)

    RCT_EXTERN_METHOD(supportedEvents)

    RCT_EXTERN_METHOD(multiply:(float)a b:(float)b resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(getRegions:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(getVersion:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(initialize:(NSDictionary *)config resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(getCurrentCall:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(getCallDictionaries:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(getProfile:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(getVoiceLanguages:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(getVideoLanguages:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(getCallDetails:(NSInteger *)callId resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(makeVoiceCall:(NSDictionary *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(makeVideoCall:(NSDictionary *)request resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(hangUp:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(toggleAudioRoute:(BOOL)toSpeaker)

    RCT_EXTERN_METHOD(sendChatMessage:(NSString *)text resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

    RCT_EXTERN_METHOD(muteCall:(BOOL)isMuted)

    RCT_EXTERN_METHOD(enableVideo:(BOOL)isVideoEnabled)

    RCT_EXTERN_METHOD(flipCamera)

    RCT_EXTERN_METHOD(dispose)

@end
