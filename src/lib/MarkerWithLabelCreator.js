import React, {
  PropTypes,
  Component,
  Children,
} from 'react';
import MarkerEventList from 'react-google-maps/lib/eventLists/MarkerEventList';
import eventHandlerCreator from 'react-google-maps/lib/utils/eventHandlerCreator';
import defaultPropsCreator from 'react-google-maps/lib/utils/defaultPropsCreator';
import composeOptions from 'react-google-maps/lib/utils/composeOptions';
import componentLifecycleDecorator from 'react-google-maps/lib/utils/componentLifecycleDecorator';

import GoogleMapHolder from 'react-google-maps/lib/creators/GoogleMapHolder';
import MarkerWithLabel from 'markerwithlabel';

export const markerControlledPropTypes = {
// NOTICE!!!!!!
//
// Only expose those with getters & setters in the table as controlled props.
//
// [].map.call($0.querySelectorAll("tr>td>code", function(it){ return it.textContent; }).filter(function(it){ return it.match(/^set/) && !it.match(/^setMap/); })
//
// https://developers.google.com/maps/documentation/javascript/3.exp/reference#Marker
  animation: PropTypes.any,
  attribution: PropTypes.any,
  clickable: PropTypes.bool,
  cursor: PropTypes.string,
  draggable: PropTypes.bool,
  icon: PropTypes.any,
  label: PropTypes.any,
  opacity: PropTypes.number,
  options: PropTypes.object,
  place: PropTypes.any,
  position: PropTypes.any,
  shape: PropTypes.any,
  title: PropTypes.string,
  visible: PropTypes.bool,
  zIndex: PropTypes.number,

  crossImage:  PropTypes.any,
  handCursor:  PropTypes.any,
  labelAnchor:  PropTypes.any,
  labelClass:  PropTypes.any,
  labelContent:  PropTypes.any,
  labelInBackground:  PropTypes.any,
  labelStyle:  PropTypes.any,
  labelVisible:  PropTypes.any,
  optimized:  PropTypes.any,
  raiseOnDrag:  PropTypes.any,
};

export const markerDefaultPropTypes = defaultPropsCreator(markerControlledPropTypes);

const markerUpdaters = {
  animation(animation, component) { component.getMarker().setAnimation(animation); },
  attribution(attribution, component) { component.getMarker().setAttribution(attribution); },
  clickable(clickable, component) { component.getMarker().setClickable(clickable); },
  cursor(cursor, component) { component.getMarker().setCursor(cursor); },
  draggable(draggable, component) { component.getMarker().setDraggable(draggable); },
  icon(icon, component) { component.getMarker().setIcon(icon); },
  label(label, component) { component.getMarker().setLabel(label); },
  opacity(opacity, component) { component.getMarker().setOpacity(opacity); },
  options(options, component) { component.getMarker().setOptions(options); },
  place(place, component) { component.getMarker().setPlace(place); },
  position(position, component) { component.getMarker().setPosition(position); },
  shape(shape, component) { component.getMarker().setShape(shape); },
  title(title, component) { component.getMarker().setTitle(title); },
  visible(visible, component) { component.getMarker().setVisible(visible); },
  zIndex(zIndex, component) { component.getMarker().setZIndex(zIndex); },
};

const { eventPropTypes, registerEvents } = eventHandlerCreator(MarkerEventList);

export const markerEventPropTypes = eventPropTypes;

class MarkerWithLabelCreator extends Component {

  static propTypes = {
    mapHolderRef: PropTypes.instanceOf(GoogleMapHolder).isRequired,
    marker: PropTypes.object.isRequired,
  }

  static _createMarker(markerProps) {
    const { mapHolderRef, anchorHolderRef } = markerProps;
    const marker = new MarkerWithLabel(composeOptions(markerProps, markerControlledPropTypes));
    if (anchorHolderRef) {
      if (`MarkerClusterer` === anchorHolderRef.getAnchorType()) {
        anchorHolderRef.getAnchor().addMarker(marker);
      }
    } else {
      marker.setMap(mapHolderRef.getMap());
    }

    return marker;
  }

  getMarker() {
    return this.props.marker;
  }

  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#InfoWindowOptions
  // In the core API, the only anchor is the Marker class.
  getAnchor() {
    return this.props.marker;
  }

  render() {
    const { mapHolderRef, children } = this.props;

    if (Children.count(children) > 0) {
      return (
        <div>{Children.map(children, childElement =>
          childElement && React.cloneElement(childElement, {
            mapHolderRef,
            anchorHolderRef: this,
          })
        )}</div>
      );
    } else {
      return (<noscript />);
    }
  }
}

let DecoractedComponent = MarkerWithLabelCreator;
DecoractedComponent = componentLifecycleDecorator({
  registerEvents,
  instanceMethodName: `getMarker`,
  updaters: markerUpdaters,
})(DecoractedComponent);

export default DecoractedComponent;