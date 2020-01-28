"use strict";
(function (w) {
    const createExtensionDeleteModal = extensions => box => {
        const {dataset: extData} = box;
        const destroyModal = () => {
            modalCard.classList.remove("tttie-slide-in");
            modalCard.classList.add("tttie-slide-out");
            modalBg.classList.add("tttie-fade-out");
            modalCard.addEventListener("animationend", () => {
                modal.remove();
            }, { 
                once: true
            });
        }
        const modal = document.createElement("div");
        modal.classList.add("modal", "is-active", "tttie-fade-in");

        const modalBg = document.createElement("div");
        modalBg.classList.add("modal-background");

        const modalCard = document.createElement("div");
        modalCard.classList.add("modal-card", "tttie-slide-in");

        const modalHeader = document.createElement("header");
        modalHeader.classList.add("modal-card-head");

        const modalHeaderLabel = document.createElement("p");
        modalHeaderLabel.classList.add("modal-card-title");
        modalHeaderLabel.innerText = "Please confirm deletion of this extension";

        modalHeader.appendChild(modalHeaderLabel);

        const modalBody = document.createElement("section");
        modalBody.classList.add("modal-card-body");
        const modalBodyIrreversible = document.createElement("b");
        modalBodyIrreversible.innerText = "This action is irreversible!";
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.id = `delete-store-${extData.id}`;
        const checkBoxLabel = document.createElement("label");
        checkBoxLabel.classList.add("checkbox");
        const checkBoxLabelSpan = document.createElement("span");
        checkBoxLabelSpan.innerText = `Delete the extension store (ID: ${extData.store})`;
        checkBoxLabel.append(checkBox, checkBoxLabelSpan);

        
        modalBody.append(document.createTextNode(
            `Are you sure you want to delete the extension ${extData.name} (${extData.id})?`
            ),
            document.createElement("br"),
            modalBodyIrreversible,
            document.createElement("br"),
            checkBoxLabel);

        const modalFooter = document.createElement("footer");
        modalFooter.classList.add("modal-card-foot");

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("button", "is-danger");
        deleteButton.innerText = "Delete";
        deleteButton.addEventListener("click", () => {
            destroyModal();
            w.ttbot.deleteExtension(checkBox.checked, extData.id).then(() => {
                box.remove();
                const notification = document.createElement("div");
                notification.classList.add("notification");
                const extensionNameTag = document.createElement("b");
                extensionNameTag.innerText = extData.name;
                const extensionIDTag = document.createElement("b");
                extensionIDTag.innerText = extData.id;
                const deleteButton = document.createElement("button");
                deleteButton.addEventListener("click", () => {
                    destroyNotification();
                    clearTimeout(autoDeleteTimeout);
                })
                const destroyNotification = () => void notification.remove();
                notification.append(
                    "The extension ",
                    extensionNameTag,
                    " (",
                    extensionIDTag,
                    ") has been deleted."
                );
                extensions.prepend(notification);
                const autoDeleteTimeout = setTimeout(() => destroyNotification(), 10000)
            });
        });

        const cancelButton = document.createElement("button");
        cancelButton.classList.add("button");
        cancelButton.innerText = "Cancel";
        cancelButton.addEventListener("click", () => {
            destroyModal();
        })

        modalFooter.append(deleteButton, cancelButton);


        modalCard.append(modalHeader,
            modalBody, 
            modalFooter);

        modal.append(modalBg,
            modalCard);

        document.body.appendChild(modal);
    }
    const extensions = document.querySelector("div.extension-list");
    const extensionBoxes = extensions.querySelectorAll("article.media");
    for (const box of extensionBoxes) {
        const deleteButton = box.querySelector("button.delete-extension");
        if (!deleteButton) continue;
        deleteButton.addEventListener("click", () => {
            createExtensionDeleteModal(extensions)(box);
        })
    }
})(window);