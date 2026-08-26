import 'dart:io';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import '../../../../core/constants/app_constants.dart';
import '../../../../core/services/session_service.dart';
import '../../../profile/data/services/profile_service.dart';
import '../../data/services/kyc_service.dart';
import '../../data/services/kyc_ocr_service.dart';
import 'kyc_camera_screen.dart';

class KycPreviewScreen
    extends StatefulWidget {
  final KycStep step;

  final String imagePath;

  // true  = automatically continue
  // false = save only this selected step
  final bool continueToNextStep;

  const KycPreviewScreen({
    super.key,
    required this.step,
    required this.imagePath,
    this.continueToNextStep = true,
  });

  @override
  State<KycPreviewScreen>
      createState() =>
          _KycPreviewScreenState();
}

class _KycPreviewScreenState
    extends State<KycPreviewScreen> {
  // =========================================================
  // COLORS
  // =========================================================

  static const Color brandPurple =
      Color(0xFF4B16C8);

  static const Color successGreen =
      Color(0xFF12B981);

  static const Color pageBackground =
      Color(0xFFF8F9FD);

  static const Color darkText =
      Color(0xFF111827);

  static const Color greyText =
      Color(0xFF64748B);

  final KycService _kycService =
      KycService();

  bool _isSaving = false;

  // =========================================================
  // SCREEN DATA
  // =========================================================

  String get _screenTitle {
    switch (widget.step) {
      case KycStep.selfie:
        return "Review Live Photo";

      case KycStep.aadhaarFront:
        return "Review Aadhaar Front";

      case KycStep.aadhaarBack:
        return "Review Aadhaar Back";
    }
  }

  String get _successTitle {
    switch (widget.step) {
      case KycStep.selfie:
        return "Live photo captured";

      case KycStep.aadhaarFront:
        return "Aadhaar front captured";

      case KycStep.aadhaarBack:
        return "Aadhaar back captured";
    }
  }

  String get _successDescription {
    switch (widget.step) {
      case KycStep.selfie:
        return "Check that your face is clear and properly visible.";

      case KycStep.aadhaarFront:
        return "Check that all details on the front side are readable.";

      case KycStep.aadhaarBack:
        return "Check that all details on the back side are readable.";
    }
  }

  String get _primaryButtonText {
    if (!widget.continueToNextStep) {
      return "Save Photo";
    }

    if (widget.step ==
        KycStep.aadhaarBack) {
      return "Finish Verification";
    }

    return "Use Photo & Continue";
  }

  int get _currentStep {
    switch (widget.step) {
      case KycStep.selfie:
        return 1;

      case KycStep.aadhaarFront:
        return 2;

      case KycStep.aadhaarBack:
        return 3;
    }
  }

  // =========================================================
  // SAVE AND CONTINUE
  // =========================================================

  Future<void>
      _handleContinue() async {
    if (_isSaving) {
      return;
    }

    setState(() {
      _isSaving = true;
    });

    KycStep? nextStep;

    switch (widget.step) {
      case KycStep.selfie:
        nextStep = KycStep.aadhaarFront;
        _kycService.updateStepStatus("Selfie", "Captured", filePath: widget.imagePath);
        ProfileService().profileImagePath = widget.imagePath;
        break;

      case KycStep.aadhaarFront:
        nextStep = KycStep.aadhaarBack;
        _kycService.updateStepStatus("Aadhaar Front", "Captured", filePath: widget.imagePath);
        final frontOcr = await KycOcrService().extractDetails(widget.imagePath);
        if (frontOcr['name'] != null && frontOcr['name']!.isNotEmpty) {
          _kycService.ocrName = frontOcr['name']!;
          ProfileService().userName = frontOcr['name']!;
        }
        if (frontOcr['aadhaarNumber'] != null) {
          _kycService.ocrAadhaarNumber = frontOcr['aadhaarNumber']!;
        }
        if (frontOcr['dob'] != null && frontOcr['dob']!.isNotEmpty) {
          _kycService.ocrDob = frontOcr['dob']!;
          ProfileService().dateOfBirth = frontOcr['dob']!;
        }
        if (frontOcr['gender'] != null && frontOcr['gender']!.isNotEmpty) {
          _kycService.ocrGender = frontOcr['gender']!;
          ProfileService().userGender = frontOcr['gender']!;
        }
        await SessionService().saveUserProfile(
          name: ProfileService().userName,
          gender: ProfileService().gender,
          age: ProfileService().dateOfBirth,
          address: ProfileService().address,
          email: ProfileService().email,
        );
        break;

      case KycStep.aadhaarBack:
        nextStep = null;
        _kycService.updateStepStatus("Aadhaar Back", "Captured", filePath: widget.imagePath);
        final backOcr = await KycOcrService().extractBackDetails(widget.imagePath);
        if (backOcr['address'] != null && backOcr['address']!.isNotEmpty) {
          _kycService.ocrAddress = backOcr['address']!;
          ProfileService().userAddress = backOcr['address']!;
        }
        if (backOcr['pinCode'] != null) {
          _kycService.ocrPinCode = backOcr['pinCode']!;
        }
        await SessionService().saveUserProfile(
          name: ProfileService().userName,
          gender: ProfileService().gender,
          age: ProfileService().dateOfBirth,
          address: ProfileService().address,
          email: ProfileService().email,
        );
        await _postKycAndFolderDocumentsToBackend();
        break;
    }

    if (!mounted) {
      return;
    }

    // =====================================================
    // INDIVIDUAL STEP MODE
    // =====================================================

    if (!widget
        .continueToNextStep) {
      // Close Preview screen.

      Navigator.pop(context);

      // Close Camera screen.

      Navigator.pop(context);

      return;
    }

    // =====================================================
    // COMPLETE GUIDED FLOW
    // =====================================================

    if (nextStep != null) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(
          builder: (context) =>
              KycCameraScreen(
            step: nextStep!,
            continueToNextStep:
                true,
          ),
        ),
      );

      return;
    }

    // =====================================================
    // ALL STEPS COMPLETED
    // =====================================================

    Navigator.of(context)
        .popUntil(
      (route) =>
          route.isFirst,
    );
  }

  Future<void> _postKycAndFolderDocumentsToBackend() async {
    final mobile = await SessionService().getUserMobile() ?? ProfileService().phoneNumber;
    final name = ProfileService().userName.isNotEmpty ? ProfileService().userName : (mobile.isNotEmpty ? mobile : "Rider");

    final folderWiseDocs = [
      {
        "folder_name": "Identity Documents (Aadhaar Card)",
        "documents": [
          {
            "doc_name": "Aadhaar Front Image",
            "file_path": _kycService.aadhaarFrontFile ?? widget.imagePath,
            "ocr_aadhaar_no": _kycService.ocrAadhaarNumber,
            "status": "Captured",
            "date": DateTime.now().toIso8601String().split('T').first,
          },
          {
            "doc_name": "Aadhaar Back Image",
            "file_path": _kycService.aadhaarBackFile ?? widget.imagePath,
            "ocr_address": _kycService.ocrAddress,
            "status": "Captured",
            "date": DateTime.now().toIso8601String().split('T').first,
          }
        ]
      },
      {
        "folder_name": "Live Verification",
        "documents": [
          {
            "doc_name": "Live Selfie Photo",
            "file_path": _kycService.livePhotoFile ?? ProfileService().profileImagePath,
            "status": "Captured",
            "date": DateTime.now().toIso8601String().split('T').first,
          }
        ]
      },
      {
        "folder_name": "Driving License & Agreements",
        "documents": [
          {
            "doc_name": "Driving License Photo",
            "file_path": ProfileService().dlImagePath ?? "dl_verification.jpg",
            "status": "Verified",
            "date": DateTime.now().toIso8601String().split('T').first,
          }
        ]
      }
    ];

    final payload = {
      "mobile": mobile,
      "rider_name": name,
      "kyc_status": "Under Review",
      "ocr_details": {
        "name": _kycService.ocrName.isNotEmpty ? _kycService.ocrName : name,
        "aadhaar_number": _kycService.ocrAadhaarNumber,
        "dob": _kycService.ocrDob,
        "gender": _kycService.ocrGender,
        "address": _kycService.ocrAddress,
        "pin_code": _kycService.ocrPinCode,
      },
      "live_photo": ProfileService().profileImagePath,
      "folders": folderWiseDocs,
    };

    final urls = [
      '${AppConstants.apiBaseUrl}/renters/kyc',
      '${AppConstants.apiBaseUrl}/renters/documents',
    ];

    for (final url in urls) {
      try {
        await http.post(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: json.encode(payload),
        ).timeout(const Duration(seconds: 4));
      } catch (e) {
        debugPrint("Error syncing KYC/documents to $url: $e");
      }
    }
  }

  // =========================================================
  // RETAKE PHOTO
  // =========================================================

  void _retakePhoto() {
    Navigator.pop(context);
  }

  // =========================================================
  // BUILD
  // =========================================================

  @override
  Widget build(
    BuildContext context,
  ) {
    return Scaffold(
      backgroundColor:
          pageBackground,

      body: SafeArea(
        child: Column(
          children: [
            // =================================================
            // HEADER
            // =================================================

            Padding(
              padding:
                  const EdgeInsets
                      .fromLTRB(
                18,
                12,
                18,
                6,
              ),

              child: Row(
                children: [
                  _buildBackButton(),

                  Expanded(
                    child: Text(
                      _screenTitle,

                      textAlign:
                          TextAlign
                              .center,

                      style:
                          const TextStyle(
                        color:
                            darkText,

                        fontSize:
                            20,

                        fontWeight:
                            FontWeight
                                .w800,
                      ),
                    ),
                  ),

                  Container(
                    padding:
                        const EdgeInsets
                            .symmetric(
                      horizontal:
                          10,

                      vertical:
                          6,
                    ),

                    decoration:
                        BoxDecoration(
                      color:
                          const Color(
                        0xFFF0EBFF,
                      ),

                      borderRadius:
                          BorderRadius
                              .circular(
                        20,
                      ),
                    ),

                    child: Text(
                      "$_currentStep of 3",

                      style:
                          const TextStyle(
                        color:
                            brandPurple,

                        fontSize:
                            10,

                        fontWeight:
                            FontWeight
                                .w800,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // =================================================
            // CONTENT
            // =================================================

            Expanded(
  child: Padding(
    padding: const EdgeInsets.fromLTRB(
      20,
      8,
      20,
      14,
    ),
    child: Column(
      children: [
        // Success badge

        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 13,
            vertical: 7,
          ),
          decoration: BoxDecoration(
            color: const Color(
              0xFFE8FFF7,
            ),
            borderRadius: BorderRadius.circular(
              30,
            ),
          ),
          child: const Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.check_circle_rounded,
                color: successGreen,
                size: 17,
              ),

              SizedBox(
                width: 6,
              ),

              Text(
                "PHOTO CAPTURED",
                style: TextStyle(
                  color: Color(
                    0xFF07875F,
                  ),
                  fontSize: 9,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.7,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(
          height: 8,
        ),

        // Success title

        Text(
          _successTitle,
          textAlign: TextAlign.center,
          style: const TextStyle(
            color: darkText,
            fontSize: 22,
            fontWeight: FontWeight.w800,
            letterSpacing: -0.4,
          ),
        ),

        const SizedBox(
          height: 4,
        ),

        // Description

        Text(
          _successDescription,
          textAlign: TextAlign.center,
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: greyText,
            fontSize: 11,
            height: 1.3,
          ),
        ),

        const SizedBox(
          height: 12,
        ),

        // Image fills available space

        Expanded(
          child: Container(
            width: double.infinity,
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              color: const Color(
                0xFF0A0F18,
              ),
              borderRadius: BorderRadius.circular(
                25,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(
                    alpha: 0.10,
                  ),
                  blurRadius: 20,
                  offset: const Offset(
                    0,
                    8,
                  ),
                ),
              ],
            ),
            child: Stack(
              fit: StackFit.expand,
              children: [
                Image.file(
                  File(
                    widget.imagePath,
                  ),
                  fit: BoxFit.cover,
                  errorBuilder: (
                    context,
                    error,
                    stackTrace,
                  ) {
                    return const Center(
                      child: Icon(
                        Icons.broken_image_outlined,
                        color: Colors.white54,
                        size: 50,
                      ),
                    );
                  },
                ),

                Positioned(
                  top: 14,
                  right: 14,
                  child: Container(
                    height: 36,
                    width: 36,
                    decoration: BoxDecoration(
                      color: successGreen,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: Colors.white,
                        width: 3,
                      ),
                    ),
                    child: const Icon(
                      Icons.check_rounded,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(
          height: 12,
        ),

        // Verification checks

        Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 14,
            vertical: 11,
          ),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(
              17,
            ),
            border: Border.all(
              color: const Color(
                0xFFE8EBF2,
              ),
            ),
          ),
          child: Column(
            children: [
              _buildCheckItem(
                widget.step == KycStep.selfie
                    ? "Face is clearly visible"
                    : "Document is clearly visible",
              ),

              const SizedBox(
                height: 8,
              ),

              _buildCheckItem(
                widget.step == KycStep.selfie
                    ? "Photo has sufficient lighting"
                    : "Document details are readable",
              ),
            ],
          ),
        ),

        const SizedBox(
          height: 12,
        ),

        // Action buttons

        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: _isSaving
                    ? null
                    : _retakePhoto,
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size(
                    0,
                    54,
                  ),
                  foregroundColor: brandPurple,
                  side: const BorderSide(
                    color: brandPurple,
                    width: 1.5,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(
                      16,
                    ),
                  ),
                ),
                child: const Text(
                  "Retake",
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
            ),

            const SizedBox(
              width: 10,
            ),

            Expanded(
              flex: 2,
              child: ElevatedButton(
                onPressed: _isSaving
                    ? null
                    : _handleContinue,
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(
                    0,
                    54,
                  ),
                  elevation: 0,
                  backgroundColor: brandPurple,
                  foregroundColor: Colors.white,
                  disabledBackgroundColor:
                      brandPurple.withValues(
                    alpha: 0.65,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(
                      16,
                    ),
                  ),
                ),
                child: _isSaving
                    ? const SizedBox(
                        height: 21,
                        width: 21,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2.5,
                        ),
                      )
                    : Row(
                        mainAxisAlignment:
                            MainAxisAlignment.center,
                        children: [
                          Flexible(
                            child: Text(
                              _primaryButtonText,
                              maxLines: 1,
                              overflow:
                                  TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight:
                                    FontWeight.w800,
                              ),
                            ),
                          ),

                          const SizedBox(
                            width: 6,
                          ),

                          const Icon(
                            Icons.arrow_forward_rounded,
                            size: 17,
                          ),
                        ],
                      ),
              ),
            ),
          ],
        ),
      ],
    ),
  ),
),
          ],
        ),
      ),
    );
  }

  // =========================================================
  // BACK BUTTON
  // =========================================================

  Widget _buildBackButton() {
    return Material(
      color: Colors.white,

      shape:
          const CircleBorder(),

      child: InkWell(
        onTap: () {
          Navigator.pop(context);
        },

        customBorder:
            const CircleBorder(),

        child: Container(
          height: 42,
          width: 42,

          decoration:
              BoxDecoration(
            shape:
                BoxShape.circle,

            border:
                Border.all(
              color:
                  const Color(
                0xFFE6E9F0,
              ),
            ),
          ),

          child:
              const Icon(
            Icons
                .arrow_back_rounded,

            color:
                darkText,

            size:
                21,
          ),
        ),
      ),
    );
  }

  // =========================================================
  // CHECK ITEM
  // =========================================================

  Widget _buildCheckItem(
    String text,
  ) {
    return Row(
      children: [
        Container(
          height: 28,
          width: 28,

          decoration:
              const BoxDecoration(
            color:
                Color(
              0xFFE8FFF7,
            ),

            shape:
                BoxShape.circle,
          ),

          child:
              const Icon(
            Icons
                .check_rounded,

            color:
                successGreen,

            size:
                17,
          ),
        ),

        const SizedBox(
          width: 11,
        ),

        Expanded(
          child: Text(
            text,

            style:
                const TextStyle(
              color:
                  darkText,

              fontSize:
                  12,

              fontWeight:
                  FontWeight
                      .w600,
            ),
          ),
        ),
      ],
    );
  }
}